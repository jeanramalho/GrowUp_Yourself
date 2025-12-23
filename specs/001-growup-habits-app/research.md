# research.md — GrowUp Yourself (Phase 0)

## Purpose
Resolve open technical choices and recommend libraries/approaches for the MVP (React Native + Expo + TypeScript) while keeping the system MVVM-first and local-first.

## Decisions

1. Decision: Use Expo + React Native + TypeScript with Expo Router for navigation.
   - Rationale: User asked explicitly for React Native, TypeScript and Expo Router; Expo accelerates development, has stable support for notifications and offline features, and improves cross-device testing. TypeScript increases safety for MVVM ViewModel interfaces.
   - Alternatives considered: Bare React Native + custom native modules (more complex); rejected for MVP due to increased infra cost.

2. Decision: Use `expo-sqlite` with a small repository-layer abstraction (Repository + DAO) for persistence in MVP.
   - Rationale: `expo-sqlite` is available in Expo-managed workflow, lightweight and stable. Wrapping it in a repository abstraction makes future migration to Realm/WatermelonDB or cloud sync straightforward.
   - Alternatives considered: Realm (easier queries, but larger binary and native installation), WatermelonDB (good for large datasets), MMKV (fast key-value). Rejected for MVP because Expo-managed flow prefers `expo-sqlite` and repository abstraction reduces lock-in.

3. Decision: Use `expo-notifications` for local scheduling and reminders.
   - Rationale: Native support in Expo; supports scheduling, permissions flows and works across platforms. Expose a NotificationService in the architecture to abstract implementation.
   - Alternatives: react-native-push-notification (older, native linking), not used to avoid extra native setup in Expo-managed flow.

4. Decision: UI library choices — use `react-native-paper` for components and `@expo/vector-icons` for icons.
   - Rationale: `react-native-paper` provides accessible Material components, theme tokens, and pairs well with Expo. `@expo/vector-icons` is standard and light. Both help achieve AA contrast and fast prototyping.
   - Alternatives: NativeBase, UI Kitten; rejected because `react-native-paper` has better alignment with tokens and accessibility out-of-the-box.

5. Decision: Charts — `react-native-svg` + `victory-native` (or `react-native-chart-kit` fallback).
   - Rationale: `victory-native` supports line & pie charts and works well with RN; `react-native-svg` is widely used as a base. Keep a thin ChartService abstraction so charts can be swapped.

6. Decision: On-device AI (Phase 2) — plan for optional integration with execute-torch-AI or local quantized LLM via a feature flag; MVP uses deterministic rule-based engine for health calculations and canned conversational rules.
   - Rationale: LLMs are optional and resource-heavy; design the architecture to allow plugging an on-device LLM later. For MVP, deterministic calculations (IMC/TMB) and rule-based parsing provide most value with deterministic behavior and easier testing.

7. Decision: Testing — Jest + React Native Testing Library for components, and unit tests for ViewModels; use a small integration test harness for DB and Notifications (node scripts + Detox or E2E later).
   - Rationale: Common RN choices; ViewModels in TypeScript are easy to unit test with Jest.

8. Decision: State management & MVVM — keep ViewModels as small classes exposing observable state via `mobx-state-tree` or minimal `zustand` + TypeScript interfaces.
   - Rationale: `mobx-state-tree` offers structured state and actions aligning with MVVM; `zustand` is simpler and also acceptable. Recommend `zustand` for MVP simplicity, with ViewModel wrappers for testability.

## Resolved Unknowns / TODOs

- Storage: chosen `expo-sqlite` wrapped by Repository abstraction.
- Notifications: `expo-notifications`.
- Charts: `victory-native` + `react-native-svg`.
- Icons: `@expo/vector-icons`.
- UI components: `react-native-paper`.
- AI: deferred to Phase 2; design only (feature flag + adapter pattern).

## Alternatives Summary (short)

- Realm: great query performance and sync, but heavier binary & native install; consider for Phase 2 if dataset grows.
- WatermelonDB: good for large data sets and offline-first sync; consider if app needs complex queries and high volume.

## Next Steps (Phase 1 inputs)

- Create `data-model.md` with concrete entities and field types (TypeScript models + DB schemas).
- Produce `contracts/` describing local CRUD contracts (schemas) for `meta`, `execucao`, `profile`, `lancamento_financeiro`, `compromisso`.
- Add quickstart.md with commands to bootstrap an Expo TypeScript project and install chosen libs.
