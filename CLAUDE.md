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

## Implementation Status

✅ **COMPLETED**: The core learning assistant features have been fully implemented in React Native.

### Implemented Components

All components from the Reference code have been converted to React Native:

1. **[VideoPlayer.tsx](components/VideoPlayer.tsx)** - Video playback with controls overlay, gradient backgrounds, play/pause functionality
2. **[VideoInfo.tsx](components/VideoInfo.tsx)** - Title and description with "Show more/less" functionality using `numberOfLines`
3. **[ActionButtons.tsx](components/ActionButtons.tsx)** - 4-column grid with haptic feedback and themed icons
4. **[QuestionPrompts.tsx](components/QuestionPrompts.tsx)** - Horizontal scrolling prompts with fade gradient indicator
5. **[InputSection.tsx](components/InputSection.tsx)** - Text input with mic icon and conditional send button
6. **[MessageBubble.tsx](components/MessageBubble.tsx)** - Chat-style messages with user/AI styling
7. **[ConversationDrawer.tsx](components/ConversationDrawer.tsx)** - Bottom sheet drawer using `@gorhom/bottom-sheet` with snap points

### Main Screen

**[app/(tabs)/index.tsx](app/(tabs)/index.tsx)** - Complete learning assistant screen with:
- Video player section (16:9 aspect ratio)
- Video info and action buttons
- Bottom sheet conversation drawer
- Keyboard avoidance and safe area handling
- Auto-pause video on input focus
- Auto-expand drawer on message submit

### Key Technical Choices

1. **@gorhom/bottom-sheet** - Used instead of custom gesture handling for better mobile UX
2. **NativeWind** - Configured but using StyleSheet.create() for most components for better type safety
3. **expo-haptics** - Added haptic feedback to all interactive elements
4. **react-native-reanimated** - Configured and ready for advanced animations
5. **GestureHandlerRootView** - Properly wrapped in root layout for gesture support

### Important Notes

- TypeScript strict mode enabled with no errors
- `Reference code/` folder excluded from TypeScript checking (see tsconfig.json)
- All colors support dark mode via theme system
- Safe areas properly handled for iOS notch/home indicator
- Keyboard avoidance configured for both iOS and Android
