# quickstart.md — How to bootstrap the MVP (Expo + TypeScript)

Prerequisites:
- Node >= 18
- npm or Yarn
<<<<<<< HEAD
- Expo CLI (optional, but recommended)

1. Create project
=======

## 1. Create project
>>>>>>> 001-growup-habits-app

```bash
npx create-expo-app GrowUpYourself --template expo-template-blank-typescript
cd GrowUpYourself
```

<<<<<<< HEAD
2. Install core dependencies (recommended for MVP)
=======
## 2. Install core dependencies
>>>>>>> 001-growup-habits-app

```bash
npm install @expo/vector-icons react-native-paper react-native-svg victory-native
npm install expo-sqlite expo-notifications expo-router
npm install zustand
npm install --save-dev jest @testing-library/react-native
```

<<<<<<< HEAD
3. Initial project layout (MVVM)
=======
## 3. Initial project layout (MVVM)
>>>>>>> 001-growup-habits-app

Create folders:

```
src/
  screens/
  viewmodels/
<<<<<<< HEAD
  services/   # notifications, storage, charts
  repositories/ # DB access
  components/  # UI atoms + design tokens
```

4. Run the app
=======
  services/
  repositories/
  components/
  models/
```

## 4. Run the app
>>>>>>> 001-growup-habits-app

```bash
npx expo start
```

<<<<<<< HEAD
5. Notes
- Implement `Repository` abstraction for storage (wrap `expo-sqlite`).
- Implement `NotificationService` to wrap `expo-notifications`.
- Keep design tokens in `src/theme/tokens.ts` and use `react-native-paper` theming.
=======
## 5. Next steps

- Implement Repository abstraction for storage
- Implement NotificationService wrapper
- Create design tokens in `src/theme/tokens.ts`
>>>>>>> 001-growup-habits-app
