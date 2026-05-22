# 🎮 INET Quest: Retro Task Arena Developer Guide (`claude.md`)

Welcome to the **INET Quest** (codenamed `retro-task-arena`) repository! This file serves as a comprehensive system prompt and development guide for developers and AI assistants working in this codebase.

---

## 🌟 Project Overview
**INET Quest** is a gamified quest tracking and project management platform. It models software development tasks as **Quests** issued by **Seniors (Quest Owners)**, to be undertaken by **Juniors (Adventurers/Travelers)**.
*   **Currency**: Gold Points (`GP` / แต้ม).
*   **Progression**: Experience Points (`EXP`) and Level (`เลเวล`) representing adventurers' achievements.
*   **Theme**: Beautiful 8-bit retro console gaming style with smooth transitions, custom pixel typography, inset 3D borders, and micro-animations.

---

## 🛠️ Technology Stack

### 💻 Frontend Architecture
*   **Core**: React 18, Vite, TypeScript 5.
*   **Styling**: Tailwind CSS 3, `clsx`, `tailwind-merge` (`cn` helper).
*   **UI Components**: shadcn/ui components customized with custom retro pixel borders and theme colors.
*   **State Management**: Zustand 5 (e.g., `useAuthStore` for user authentication, `useThemeStore` for themes).
*   **Data Fetching & Caching**: `@tanstack/react-query` (React Query 5) and Axios.
*   **Live WebSockets**: Centrifuge client connecting to `Centrifugo` WebSocket server.
*   **Localization (i18n)**: `i18next` & `react-i18next` with `i18next-browser-languagedetector` for automatic language selection.
*   **Animations**: Framer Motion 12 & pure CSS keyframe micro-animations.

### 🔌 Sibling Backend Architecture (`inet-quest-backend`)
*   **Server Framework**: Go (Golang) with **Fiber** framework running on port `5000` (exposed via API port `5001`).
*   **Databases**: MySQL (primary, port `3307`, db `inet_quest`), MongoDB (port `27018`), Redis (port `6378`).
*   **WebSocket Engine**: Centrifugo (port `8000`) for pub/sub notifications.
*   **Auth Provider**: OneID integration.

---

## 📁 Repository Directory Structure

```
retro-task-arena/
├── .env                  # Frontend environment variables (VITE_API_BASE_URL)
├── package.json          # Dependency definitions and dev scripts
├── tailwind.config.ts    # Custom pixel themes, colors, and layout setup
├── src/
│   ├── main.tsx          # Application entrypoint
│   ├── App.tsx           # Route declarations & main providers
│   ├── App.css           # Core CSS overrides
│   ├── index.css         # Styling system (8-bit animations, light/dark HSL themes, fonts)
│   ├── components/       # Core Custom Retro UI elements
│   │   ├── ExpBar.tsx         # Gamified level progression bar
│   │   ├── PixelButton.tsx    # Customized 3D 8-bit button with active inset states
│   │   ├── PixelFrame.tsx     # 8-bit frame box wrapper/card container
│   │   ├── PixelInput.tsx     # 8-bit input component
│   │   ├── PixelTextarea.tsx  # 8-bit text area component
│   │   ├── PixelDivider.tsx   # Custom border line divider
│   │   └── PixelBackground.tsx# Layered starry scroll background with drifting particles
│   ├── features/         # Domain-Driven Modules
│   │   ├── admin/             # Senior/Junior user lists, quest listings, orders management
│   │   ├── auth/              # LoginPage, protected routes, and auth store
│   │   ├── bids/              # SubmitBid & Bid management pages
│   │   ├── dashboard/         # Stat grids, donut charts, progress trackers
│   │   ├── quests/            # Quest board, detail, create, edit, & workspace
│   │   ├── ranking/           # Leaderboards & podium displays
│   │   ├── rewards/           # Reward shop, purchase flow, item creation
│   │   └── users/             # Profile pages, edit forms, transaction histories
│   ├── i18n/             # i18next configuration
│   ├── locales/          # Translation json assets
│   │   ├── en/translation.json
│   │   └── th/translation.json
│   ├── store/            # Shared stores (e.g., ThemeStore)
│   └── lib/              # Utility helpers (e.g. cn)
```

---

## 🎨 Theme & Styling System

The project supports a dual-theme system (Dark/Light).
*   **Dark Mode**: Dark cybernetic medieval dungeon theme.
*   **Light Mode**: "Outdoor Guild Parchment" theme. Everything is wood-grained, sun-warmed parchment paper (`#EDE4CF`) rather than blinding white.

### Custom Pixel Utility Classes (from `src/index.css`)
1.  **Pixel Typography**:
    *   Headers/Pixel art text: `.font-pixel` (uses custom `TA_8bit` or fallback `Press Start 2P` font).
    *   Paragraphs/Body text: `.font-pixel-body` (uses `VT323` font).
2.  **Text Shadow**:
    *   `.pixel-text-shadow`: Deep drop-shadow for retro text.
    *   `.pixel-text-shadow-accent`: Colored drop-shadow for active highlights.
3.  **Borders & Insets**:
    *   `.pixel-border`: 3px solid borders with 3D inset shadows to create simulated retro depth.
    *   `.pixel-border-pressed`: Sinks/translates button content on active click state.
    *   `.pixel-inset`: Embedded shadow (perfect for input fields/text areas).
4.  **Key Micro-Animations**:
    *   `.animate-float-coin`: Smooth coin hovering/floating effect.
    *   `.animate-pulse-gold`: Shimmering golden glow.
    *   `.animate-torch`: Step-based torch flicker simulation (vintage frame rate feel).
    *   `.animate-blink-star`: Intermittent star blinking.
    *   `.animate-points-pop`: Pop-up floating points indicator.
    *   `.animate-coin-rain`: Reward splash/rain effect.

---

## 🛑 Strict Development Guidelines

### 1. Retro UI Consistency
*   **Never** use default HTML buttons, inputs, or standard shadcn buttons without customization.
*   **Always** leverage the dedicated custom components:
    *   Button -> [PixelButton](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/components/PixelButton.tsx)
    *   Frame/Card Container -> [PixelFrame](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/components/PixelFrame.tsx)
    *   Text Input -> [PixelInput](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/components/PixelInput.tsx)
    *   Textarea -> [PixelTextarea](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/components/PixelTextarea.tsx)
    *   Divider Line -> [PixelDivider](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/components/PixelDivider.tsx)
    *   Level Progress -> [ExpBar](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/components/ExpBar.tsx)

### 2. Mandatory Localization (i18n)
*   **Do not hardcode** any user-facing strings inside JSX components.
*   All UI strings, error alerts, placeholders, success notifications, and table headers **MUST** be translated using the `useTranslation` hook from `react-i18next`.
*   **Localization Files**:
    *   Thai strings: [translation.json (th)](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/locales/th/translation.json)
    *   English strings: [translation.json (en)](file:///c:/Users/Lenovo/Desktop/inet-quest/retro-task-arena/src/locales/en/translation.json)
*   **Strict Spelling Rule**: Always spell "เควสต์" (with ทัณฑฆาต) for the word "Quest" in Thai translations. "เควส" is deprecated and unacceptable.

### 3. State Management & API Requests
*   Store persistent client states in Zustand stores (`persist` middleware). Ensure actions are structured within the store.
*   Perform all asynchronous server-state fetching and cache management using `@tanstack/react-query` to ensure optimized network requests.
*   Use the base Axios configurations to communicate with the backend (`VITE_API_BASE_URL` defined in `.env`). Do not perform raw `fetch` calls directly.

### 4. Git & Workflow Commands (Quest Workspace)
When simulating or implementing terminal interaction guides for quests:
1.  **Clone**: `git clone <repo_url>`
2.  **Branch**: `git checkout -b <branch_name>`
3.  **Solve/Commit**: `git add .` -> `git commit -m "Quest solved"`
4.  **Push & Review**: `git push origin <branch_name>`
