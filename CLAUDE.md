# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **iOS Learning Assistant** built with React Native and Expo. The project goal is to replicate a web-based video learning interface (found in `Reference code/`) as a cross-platform mobile application featuring:
- Video player with playback controls
- AI-powered conversation drawer interface
- Question prompts for learning assistance
- Chat-style messaging UI

**Important**: The `Reference code/` directory contains a complete Vite/React web implementation that serves as the **design specification**. Reference this when implementing mobile features. **Do not make changes to this folder.**

## Development Commands

### Main Project (React Native)
```bash
npm install              # Install dependencies
npm start               # Start Expo dev server
npm run ios             # Run on iOS simulator
npm run android         # Run on Android emulator
npm run web             # Run web version
npm run lint            # Run ESLint
```

### Reference Implementation (Web)
```bash
cd "Reference code"
npm install             # First time setup
npm run dev             # Start Vite dev server (localhost:3000)
```

Use the reference implementation to understand target UI/UX before implementing in React Native.

## Architecture

### File-Based Routing (Expo Router)

Navigation structure is defined by the file system:
- `app/(tabs)/` - Route group for tab navigation (parentheses = layout-only, not in URL)
- `app/_layout.tsx` - Root layout with theme provider
- `app/(tabs)/_layout.tsx` - Tab navigator configuration
- `app/modal.tsx` - Modal screens accessed via router

**Key Pattern**: `_layout.tsx` files define navigation containers, while other files become routes.

### Themed Component System

The app uses a centralized theming system for dark/light mode:
- **Constants**: [constants/theme.ts](constants/theme.ts) defines `Colors` object with light/dark variants
- **Hooks**:
  - `useColorScheme()` - Detects system color scheme
  - `useThemeColor()` - Resolves colors based on current theme
- **Components**: `ThemedText` and `ThemedView` automatically adapt to theme

**Pattern**: When creating new components, use `useThemeColor()` hook rather than hardcoded colors.

### Platform-Specific Implementations

Components can have platform-specific variants using file extensions:
- `component.tsx` - Default implementation
- `component.ios.tsx` - iOS-specific override
- `component.web.tsx` - Web-specific override
- `component.android.tsx` - Android-specific override

React Native's metro bundler automatically resolves the correct variant. See [components/ui/icon-symbol.ios.tsx](components/ui/icon-symbol.ios.tsx) for example.

### TypeScript Configuration

- **Strict mode enabled** - All code must be type-safe
- **Path alias**: `@/*` maps to project root (e.g., `import { Colors } from '@/constants/theme'`)
- **Typed routes**: Experimental feature provides type-safe navigation

## Key Technical Context

### New Architecture Enabled

This project uses React Native's "New Architecture" (enabled in [app.json](app.json)):
- Turbo Modules for native module system
- Fabric renderer for UI
- React Compiler experimental feature active

Be aware of compatibility when adding native dependencies.

### Reference Code Structure

The web reference implementation ([Reference code/src/App.tsx](Reference%20code/src/App.tsx)) shows:
- Main layout: video player on left, conversation drawer on right
- Key components:
  - `VideoPlayer` - Embedded video with controls
  - `ConversationDrawer` - Expandable chat interface
  - `QuestionPrompts` - Suggested questions
  - `InputSection` - Message input with send button
- UI library: Radix UI with Tailwind CSS
- Animations: Framer Motion

When implementing React Native equivalents:
- Use `react-native-reanimated` instead of Framer Motion
- Replace Radix UI with React Native equivalents
- Adapt responsive layout for mobile viewports

### Component Development Pattern

1. Create themed wrapper components for consistent styling
2. Use platform-specific files when native APIs differ
3. Leverage hooks for reusable stateful logic
4. Export TypeScript interfaces for props

See [components/parallax-scroll-view.tsx](components/parallax-scroll-view.tsx) for example of composed themed components.

### Testing

**No testing framework currently configured.** If adding tests:
- Install `jest-expo` and `@testing-library/react-native`
- Add test scripts to [package.json](package.json)
- Follow Expo testing conventions

## Project Status

The project structure and boilerplate are complete, but the core learning assistant features need implementation. The `Reference code/` directory provides the complete functional specification to replicate in React Native.
