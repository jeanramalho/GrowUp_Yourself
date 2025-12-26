# Implementation Plan: GrowUp Yourself — MVP

**Branch**: `001-growup-habits-app` | **Date**: 2025-12-26 | **Spec**: [spec.md](spec.md)

## Summary

Implement an Expo + React Native + TypeScript MVP named "GrowUp Yourself" that provides a TabBar of four pillars (Espiritualidade, Saúde, Finanças, Relacionamentos) plus Profile. Core features: create/execute/record weekly metas, local scheduling of reminders, monthly progress aggregation (header), finance planning vs reals, and an on-device-ready architecture for later AI integration. The technical approach favors Expo-managed workflow, `expo-sqlite` persistence behind a Repository abstraction, `expo-notifications` for scheduling, `react-native-paper` for accessible UI components, and a small ViewModel layer (MVVM) implemented with simple `zustand` stores or lightweight ViewModel wrappers.

## Technical Context

**Language/Version**: TypeScript (>=4.9), React Native via Expo (SDK 49+ recommended)  
**Primary Dependencies**: React Native, Expo, Expo Router, @expo/vector-icons, react-native-paper, react-native-svg, victory-native, zustand, jest, @testing-library/react-native  
**Storage**: On-device SQLite (expo-sqlite) via a Repository abstraction (migrations supported)  
**Testing**: Jest + React Native Testing Library for unit/component tests; integration scripts for DB and notifications; E2E with Detox optional in Phase 2  
**Target Platform**: Mobile — iOS and Android (phones primary, tablet responsive)  
**Project Type**: Mobile app (single-project Expo-managed)  
**Performance Goals**: App cold start < 2s on modern devices; smooth UI 60fps for primary flows; DB reads/writes < 50ms typical for small datasets  
**Constraints**: Offline-first, single-user per device, package size kept modest (MVP under ~100MB), permissions-aware notifications  
**Scale/Scope**: MVP: ~8–12 screens, core modules for 4 pillars, profile, backups

## Constitution Check

Constitution Check Matrix:

| Check | Result | Notes |
|---|---:|---|
| MVVM-first | Yes | Views will be thin; ViewModels in `src/viewmodels` expose typed state and commands |
| Local-first | Yes | All user flows persist locally via Repository abstraction over `expo-sqlite` |
| Design Tokens | Yes | `src/theme/tokens.ts` will hold colors, spacing, typography; `react-native-paper` theme wired to tokens |
| Accessibility | Yes | Use `react-native-paper` accessible components; enforce AA contrast & targets >=44px |
| Tests | Yes (required) | Unit tests for ViewModels + integration scripts for DB and notifications required before merge |
| Privacy | Yes | Single-user local-first; backups require explicit export action; no network by default |

## Project Structure

### Chosen Source Layout

```
src/
  screens/           # React components (Views)
  viewmodels/        # ViewModel classes or hooks (observable state, orchestration)
  components/        # Reusable UI components (MetaCard, HeaderProgress...)
  repositories/      # DB access + migrations (SQLite wrapper)
  services/          # NotificationService, ChartService, BackupService, AI Adapter
  theme/             # design tokens and theme wiring
  models/            # TypeScript interfaces shared across layers

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
