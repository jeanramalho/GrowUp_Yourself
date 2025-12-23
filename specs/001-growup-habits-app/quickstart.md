# quickstart.md — How to bootstrap the MVP (Expo + TypeScript)

Prerequisites:
- Node >= 18
- npm or Yarn
- Expo CLI (optional, but recommended)

1. Create project

```bash
npx create-expo-app GrowUpYourself --template expo-template-blank-typescript
cd GrowUpYourself
```

2. Install core dependencies (recommended for MVP)

```bash
npm install @expo/vector-icons react-native-paper react-native-svg victory-native
npm install expo-sqlite expo-notifications expo-router
npm install zustand
npm install --save-dev jest @testing-library/react-native
```

3. Initial project layout (MVVM)

Create folders:

```
src/
  screens/
  viewmodels/
  services/   # notifications, storage, charts
  repositories/ # DB access
  components/  # UI atoms + design tokens
```

4. Run the app

```bash
npx expo start
```

5. Notes
- Implement `Repository` abstraction for storage (wrap `expo-sqlite`).
- Implement `NotificationService` to wrap `expo-notifications`.
- Keep design tokens in `src/theme/tokens.ts` and use `react-native-paper` theming.
