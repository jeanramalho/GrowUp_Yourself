# research.md — GrowUp Yourself (Phase 0)

## Purpose
Resolve open technical choices and recommend libraries/approaches for the MVP (React Native + Expo + TypeScript) while keeping the system MVVM-first and local-first.

## Decisions

1. Decision: Use Expo + React Native + TypeScript with Expo Router for navigation.
   - Rationale: User asked explicitly for React Native, TypeScript and Expo Router; Expo accelerates development, has stable support for notifications and offline features, and improves cross-device testing. TypeScript increases safety for MVVM ViewModel interfaces.
   - Alternatives considered: Bare React Native + custom native modules (more complex); rejected for MVP due to increased infra cost.

2. Decision: Use `expo-sqlite` with a small repository-layer abstraction (Repository + DAO) for persistence in MVP.
   - Rationale: `expo-sqlite` is available in Expo-managed workflow, lightweight and stable. Wrapping it in a repository abstraction makes future migration to Realm/WatermelonDB or cloud sync straightforward.
   - Alternatives considered: Realm, WatermelonDB, MMKV; rejected for MVP because Expo-managed flow prefers `expo-sqlite` and repository abstraction reduces lock-in.

3. Decision: Use `expo-notifications` for local scheduling and reminders.
   - Rationale: Native support in Expo; supports scheduling, permissions flows and works across platforms. Expose a NotificationService in the architecture to abstract implementation.

4. Decision: UI library choices — use `react-native-paper` for components and `@expo/vector-icons` for icons.
   - Rationale: `react-native-paper` provides accessible Material components, theme tokens, and pairs well with Expo. `@expo/vector-icons` is standard and light. Both help achieve AA contrast and fast prototyping.

5. Decision: Charts — `react-native-svg` + `victory-native`.
   - Rationale: `victory-native` supports line & pie charts; `react-native-svg` is widely used as a base. Keep a thin ChartService abstraction so charts can be swapped.

6. Decision: On-device AI (Phase 2) — plan for optional integration with execute-torch-AI or local quantized LLM via a feature flag; MVP uses deterministic rule-based engine for health calculations.
   - Rationale: LLMs are optional and resource-heavy; design allows plugging an on-device LLM later. For MVP, deterministic calculations (IMC/TMB) and rule-based parsing provide most value with easier testing.

7. Decision: Testing — Jest + React Native Testing Library for components, and unit tests for ViewModels.
   - Rationale: Common RN choices; ViewModels in TypeScript are easy to unit test with Jest.

8. Decision: State management & MVVM — keep ViewModels as small classes exposing observable state via `zustand` + TypeScript interfaces.
   - Rationale: `zustand` is simpler and pairs well with TypeScript for ViewModel wrappers; provides testability.

## Resolved Unknowns

- Storage: chosen `expo-sqlite` wrapped by Repository abstraction.
- Notifications: `expo-notifications`.
- Charts: `victory-native` + `react-native-svg`.
- Icons: `@expo/vector-icons`.
- UI components: `react-native-paper`.
- AI: deferred to Phase 2; design only (feature flag + adapter pattern).
