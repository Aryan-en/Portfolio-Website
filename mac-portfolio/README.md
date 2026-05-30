# macOS Portfolio Website

A creative, interactive portfolio website that mimics the macOS desktop experience. Built with modern web technologies, this project showcases a fully functional macOS-style UI with draggable windows, a dock, menu bar, and desktop shortcuts.

## 🎨 Features

- **macOS-Style Desktop Interface**: Full desktop metaphor with draggable windows and intuitive interactions
- **Interactive Components**:
  - Desktop folder shortcuts (About Me, Projects, Achievements, Contact)
  - Animated dock at the bottom
  - System menu bar at the top
  - Splash screen and login screen
  - Smooth animations and transitions
- **Responsive Design**: Optimized for desktop with mobile fallback
- **Custom Wallpaper**: Beautiful Goa landscape background
- **Dark Theme**: Modern dark mode aesthetic inspired by macOS Sonoma/Ventura
- **State Management**: Global state using Zustand for window management
- **Smooth Animations**: Framer Motion for polished interactions

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) - React framework with SSR/SSG
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion) - React animation library
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- **UI Components**: [Lucide React](https://lucide.dev) - Beautiful icon library
- **Draggable Windows**: [React RND](https://github.com/bokuweb/react-rnd) - Draggable and resizable component
- **Language**: TypeScript - Type-safe development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aryan-en/Portfolio-Website.git
cd Portfolio-Website/mac-portfolio
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3001` (or the next available port).

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
mac-portfolio/
├── app/
│   ├── components/
│   │   ├── Desktop.tsx        # Main desktop component
│   │   ├── Dock.tsx           # Bottom dock navigation
│   │   ├── MenuBar.tsx        # Top menu bar
│   │   ├── DockIcons.tsx      # Dock icon components
│   │   ├── SplashScreen.tsx   # Initial splash screen
│   │   └── LoginScreen.tsx    # Login screen
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── src/
│   └── store/
│       └── useOsStore.ts      # Zustand state management
├── public/
│   └── wallpaper.png          # Desktop background
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🎯 Usage

### Desktop Interaction

- **Folder Shortcuts**: Click on desktop folders to open applications
- **Dock**: Access pinned applications from the bottom dock
- **Menu Bar**: System information and quick actions at the top
- **Draggable Windows**: Windows can be moved around the desktop
- **Mobile View**: Optimized mobile experience with grid layout

### Customization

- Edit `DESKTOP_FOLDERS` in [Desktop.tsx](app/components/Desktop.tsx) to add/modify folder shortcuts
- Update wallpaper by replacing `public/wallpaper.png`
- Customize colors and styles in component files using Tailwind CSS
- Modify state management in [useOsStore.ts](src/store/useOsStore.ts)

## 📝 Development

### Code Formatting & Linting

```bash
npm run lint
```

### File Structure Tips

- Components in `app/components/` handle UI
- State management centralized in `src/store/`
- Styles use Tailwind CSS with inline `style` props for dynamic values
- Use TypeScript interfaces for type safety

## 🚢 Deployment

This Next.js app can be deployed on any platform that supports Node.js:

- **Vercel** (Recommended): `vercel`
- **Netlify**: Connect GitHub repo for auto-deploy
- **Docker**: Standard Node.js containerization
- **Traditional Hosting**: Run `npm run build && npm start`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Zustand](https://github.com/pmndrs/zustand)
- [React RND](https://github.com/bokuweb/react-rnd)

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ by Aryan Singh
