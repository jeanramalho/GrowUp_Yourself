<<<<<<< HEAD
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.
=======
# Implementation Plan: GrowUp Yourself — MVP

**Branch**: `001-growup-habits-app` | **Date**: 2025-12-26 | **Spec**: [spec.md](spec.md)
>>>>>>> 001-growup-habits-app

## Summary

Implement an Expo + React Native + TypeScript MVP named "GrowUp Yourself" that provides a TabBar of four pillars (Espiritualidade, Saúde, Finanças, Relacionamentos) plus Profile. Core features: create/execute/record weekly metas, local scheduling of reminders, monthly progress aggregation (header), finance planning vs reals, and an on-device-ready architecture for later AI integration. The technical approach favors Expo-managed workflow, `expo-sqlite` persistence behind a Repository abstraction, `expo-notifications` for scheduling, `react-native-paper` for accessible UI components, and a small ViewModel layer (MVVM) implemented with simple `zustand` stores or lightweight ViewModel wrappers.

## Technical Context

<<<<<<< HEAD
<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (>=4.9), React Native via Expo (SDK 49+ recommended)
**Primary Dependencies**: React Native, Expo, Expo Router, @expo/vector-icons, react-native-paper, react-native-svg, victory-native, zustand (or mobx alternative), jest, @testing-library/react-native
**Storage**: On-device SQLite (expo-sqlite) via a Repository abstraction (migrations supported)
**Testing**: Jest + React Native Testing Library for unit/component tests; integration scripts for DB and notifications; E2E with Detox or Expo E2E in Phase 2
**Target Platform**: Mobile — iOS and Android (phones primary, tablet responsive)
**Project Type**: Mobile app (single-project Expo-managed)
**Performance Goals**: App cold start < 2s on modern devices; smooth UI 60fps for primary flows; DB reads/writes < 50ms typical for small datasets
**Constraints**: Offline-first, single-user per device, package size kept modest (MVP under ~100MB), permissions-aware notifications
=======
**Language/Version**: TypeScript (>=4.9), React Native via Expo (SDK 49+ recommended)  
**Primary Dependencies**: React Native, Expo, Expo Router, @expo/vector-icons, react-native-paper, react-native-svg, victory-native, zustand, jest, @testing-library/react-native  
**Storage**: On-device SQLite (expo-sqlite) via a Repository abstraction (migrations supported)  
**Testing**: Jest + React Native Testing Library for unit/component tests; integration scripts for DB and notifications; E2E with Detox optional in Phase 2  
**Target Platform**: Mobile — iOS and Android (phones primary, tablet responsive)  
**Project Type**: Mobile app (single-project Expo-managed)  
**Performance Goals**: App cold start < 2s on modern devices; smooth UI 60fps for primary flows; DB reads/writes < 50ms typical for small datasets  
**Constraints**: Offline-first, single-user per device, package size kept modest (MVP under ~100MB), permissions-aware notifications  
>>>>>>> 001-growup-habits-app
**Scale/Scope**: MVP: ~8–12 screens, core modules for 4 pillars, profile, backups

## Constitution Check

<<<<<<< HEAD
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This project uses the GrowUp Yourself constitution. The plan below verifies each gate requirement.

=======
>>>>>>> 001-growup-habits-app
Constitution Check Matrix:

| Check | Result | Notes |
|---|---:|---|
| MVVM-first | Yes | Views will be thin; ViewModels in `src/viewmodels` expose typed state and commands |
| Local-first | Yes | All user flows persist locally via Repository abstraction over `expo-sqlite` |
| Design Tokens | Yes | `src/theme/tokens.ts` will hold colors, spacing, typography; `react-native-paper` theme wired to tokens |
| Accessibility | Yes | Use `react-native-paper` accessible components; enforce AA contrast & targets >=44px |
| Tests | Yes (required) | Unit tests for ViewModels + integration scripts for DB and notifications required before merge |
| Privacy | Yes | Single-user local-first; backups require explicit export action; no network by default |

<<<<<<< HEAD
Include these checks as part of PR template and CI gating.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Single Expo-managed mobile project with MVVM folders. Concrete layout below.

### Chosen Source Layout (concrete)
=======
## Project Structure

### Chosen Source Layout
>>>>>>> 001-growup-habits-app

```
src/
  screens/           # React components (Views)
  viewmodels/        # ViewModel classes or hooks (observable state, orchestration)
  components/        # Reusable UI components (MetaCard, HeaderProgress...)
  repositories/      # DB access + migrations (SQLite wrapper)
  services/          # NotificationService, ChartService, BackupService, AI Adapter
  theme/             # design tokens and theme wiring
  models/            # TypeScript interfaces shared across layers
<<<<<<< HEAD
tests/
  unit/
  integration/
e2e/                 # optional E2E harness later
```

Reference files created in `specs/001-growup-habits-app/` (this plan, research.md, data-model.md, contracts/openapi.yaml, quickstart.md).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
=======

tests/
  unit/
  integration/

e2e/                 # optional E2E harness later
```

### Documentation

```
specs/001-growup-habits-app/
├── spec.md              # Feature specification with user stories
├── plan.md              # This file
├── research.md          # Phase 0 technical decisions
├── data-model.md        # Phase 1 entities and schemas
├── quickstart.md        # Getting started instructions
├── contracts/           # Contract definitions (OpenAPI-style)
└── checklists/          # Quality checklists
    └── requirements.md
```
>>>>>>> 001-growup-habits-app
