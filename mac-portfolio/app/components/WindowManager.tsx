"use client";

import { useOsStore } from '@/src/store/useOsStore';
import { AppWindow } from './AppWindow';

export function WindowManager() {
  const windows = useOsStore((s) => s.windows);

  // Render all windows that are open and not minimised.
  // Minimised windows stay in the store (so the dock badge persists) but are
  // not mounted in the DOM, which prevents unnecessary iframe requests.
  const visible = windows.filter((w) => w.isOpen && !w.isMinimized);

  return (
    <>
      {visible.map((win) => (
        <AppWindow key={win.id} win={win} />
      ))}
    </>
  );
}
