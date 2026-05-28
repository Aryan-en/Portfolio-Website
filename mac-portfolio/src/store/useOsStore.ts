import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AppWindow {
  /** Stable identifier — matches the app slug used in dock/menu registries. */
  id: string;
  /** Displayed in the window's title bar. */
  title: string;
  /** Whether the window is present in the window stack at all. */
  isOpen: boolean;
  /** Collapsed to the dock; visually hidden but retained in the stack so the
   *  dock badge / restore flow can reference it. */
  isMinimized: boolean;
  /** Scaled to fill the viewport via CSS transform; position is frozen while
   *  maximized so it restores correctly on un-maximize. */
  isMaximized: boolean;
  /** Left offset in px — consumed directly by react-rnd's `position.x`. */
  x: number;
  /** Top offset in px — consumed directly by react-rnd's `position.y`. */
  y: number;
  /** Width in px or a CSS string (e.g. '80%') for fluid layouts. */
  width: number | string;
  /** Height in px or a CSS string for fluid layouts. */
  height: number | string;
  /** CSS z-index; incremented by the layering engine on every focus event. */
  zIndex: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store shape
// ─────────────────────────────────────────────────────────────────────────────

interface OsState {
  windows: AppWindow[];

  /**
   * Global high-water mark for z-index values.  Every focus event increments
   * this counter and writes the new value onto the target window, guaranteeing
   * that the most recently touched window is always visually on top without
   * having to re-sort the entire array.
   */
  highestZIndex: number;

  openApp: (
    id: string,
    title: string,
    defaultLayout?: Partial<Omit<AppWindow, 'id' | 'title' | 'isOpen' | 'zIndex'>>,
  ) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  toggleMaximizeApp: (id: string) => void;
  focusApp: (id: string) => void;
  updateAppLayout: (id: string, updates: Partial<AppWindow>) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Clears desktop-icon layers (typically z-index 1–9). */
const BASE_Z_INDEX = 10;

const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 520;

/**
 * Returns a random integer in [MIN_OFFSET, MAX_OFFSET].
 * Applied independently to x and y so cascading windows form a visual
 * staircase rather than stacking exactly on top of one another.
 */
const MIN_OFFSET = 40;
const MAX_OFFSET = 90;
const randomOffset = (): number =>
  Math.floor(Math.random() * (MAX_OFFSET - MIN_OFFSET + 1)) + MIN_OFFSET;

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useOsStore = create<OsState>()((set, get) => ({
  windows: [],
  highestZIndex: BASE_Z_INDEX,

  /**
   * Opens an application window.
   *
   * Three cases are handled in priority order:
   *   1. Window exists and is minimised  → restore + focus.
   *   2. Window exists and is visible    → focus only (no-op if already front).
   *   3. Window does not exist           → instantiate with staggered coordinates.
   */
  openApp: (id, title, defaultLayout = {}) => {
    const { windows, highestZIndex } = get();
    const existing = windows.find((w) => w.id === id);

    if (existing) {
      if (existing.isMinimized) {
        // Restore from dock: un-minimize and float to front in one atomic write.
        const nextZ = highestZIndex + 1;
        set({
          highestZIndex: nextZ,
          windows: windows.map((w) =>
            w.id === id
              ? { ...w, isMinimized: false, isOpen: true, zIndex: nextZ }
              : w,
          ),
        });
      } else {
        // Already visible — just bring to front (focusApp guards against
        // a redundant re-render when it is already the topmost window).
        get().focusApp(id);
      }
      return;
    }

    // Brand-new window: apply independent x/y stagger so successive openApp
    // calls at the same tick don't land in the exact same position.
    const nextZ = highestZIndex + 1;
    const newWindow: AppWindow = {
      id,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: randomOffset(),
      y: randomOffset(),
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      zIndex: nextZ,
      // Caller-supplied overrides are spread last so they win over defaults.
      ...defaultLayout,
    };

    set({
      highestZIndex: nextZ,
      windows: [...windows, newWindow],
    });
  },

  /**
   * Completely removes the window from the stack.
   * The dock should remove its active indicator in response to this.
   */
  closeApp: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  /**
   * Collapses the window to the dock without destroying its state.
   * The window remains in the array so the dock can display a badge
   * and the restore path in openApp can find it.
   */
  minimizeApp: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w,
      ),
    }));
  },

  /**
   * Toggles the fullscreen flag.  The actual visual scaling is handled by the
   * Window component via a CSS/Framer Motion transition keyed on isMaximized,
   * so the store only owns the boolean.
   */
  toggleMaximizeApp: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w,
      ),
    }));
  },

  /**
   * Brings a window to the front of the layer stack.
   *
   * The guard `target.zIndex === highestZIndex` prevents a redundant setState
   * when the user clicks an already-focused window — React will not schedule
   * a re-render for a state write that produces an identical reference, but
   * skipping the write entirely avoids the object-creation overhead too.
   */
  focusApp: (id) => {
    const { windows, highestZIndex } = get();
    const target = windows.find((w) => w.id === id);

    if (!target || target.zIndex === highestZIndex) return;

    const nextZ = highestZIndex + 1;
    set({
      highestZIndex: nextZ,
      windows: windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZ } : w,
      ),
    });
  },

  /**
   * Merges position/size updates originating from react-rnd drag and resize
   * callbacks directly onto the target window.  Keyed writes (x, y, width,
   * height) are the hot path during drag; spreading a small Partial is cheaper
   * than a full window replacement.
   */
  updateAppLayout: (id, updates) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, ...updates } : w,
      ),
    }));
  },
}));
