"""
Sync Impact Report

Version change: UNSET -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> Clean Architecture (MVVM-first)
- [PRINCIPLE_2_NAME] -> Separation of Concerns & Testability
- [PRINCIPLE_3_NAME] -> Local-first Privacy & Offline Persistence
- [PRINCIPLE_4_NAME] -> Scalability, Theming & Tokens
- [PRINCIPLE_5_NAME] -> Observability, Accessibility & Governance
Added sections: Additional Constraints (Architecture & Standards), Development Workflow (Quality Gates)
Removed sections: none
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ⚠ pending (review for new mandatory fields)
- .specify/templates/tasks-template.md ⚠ pending (align task categories)
Follow-up TODOs:
- TODO(RATIFICATION_DATE): original adoption date unknown — please confirm
"""

# GrowUp Yourself — Constitution

## Core Principles

### I. Clean Architecture (MVVM-first)
Every feature MUST follow MVVM layering: UI (View) ↔ ViewModel (state, orchestration) ↔ Domain (use-cases, validation) ↔ Data (repositories, persistence). Views MUST contain no business rules. ViewModels MUST be small, testable units that expose observable state and commands. This ensures predictable UI behavior, easy unit testing, and independent development of platform-specific UI.

### II. Separation of Concerns & Testability
Code MUST be organized by responsibility: UI, Domain, Data and Infrastructure. Modules MUST expose minimal public interfaces and provide unit tests for core behavior. Integration tests are REQUIRED for persistence, notifications, and AI inference flows. CI gates MUST fail on regressions to these tests.

### III. Local-first Privacy & Offline Persistence
User data MUST be stored locally by default; no network transmission occurs without explicit, opt-in action. The app MUST support offline-first workflows: all primary features (create/execute/mark metas, finance entries, agenda items, profile) MUST function without connectivity. Persist using SQLite (or equal-performing local DB) through a repository abstraction to enable future sync.

### IV. Scalability, Theming & Configurability
The codebase MUST use design tokens and a single source of truth for app-level variables (app name, colors, spacing, typography, feature flags). Feature modules MUST be decoupled so online auth, cloud sync or multi-user support can be added later with minimal code changes. Theme (light/dark) and palette MUST be configurable by tokens.

### V. Observability, Accessibility & Governance
Logging, metrics, and graceful error reporting MUST be present for core subsystems (storage, notifications, AI). Accessibility (AA contrast, dynamic type, touch targets ≥44px, semantic labels) is REQUIRED. Security practices for local backups (export/import) MUST include optional encryption. All architectural changes that alter principle guarantees require a constitution-major bump and documented migration plan.

## Additional Constraints (Architecture & Standards)
1. Tech stack: React Native + Expo recommended; on-device AI via execute-torch-AI is allowed with graceful fallback.  
2. Persistence: SQLite recommended; access through repository interfaces and migrations.  
3. Notifications: Use platform local notifications; tests must verify scheduling and edge cases (late starts).  
4. UI: Use design tokens (colors, typography, spacing) and the component names in design spec (`HeaderProgress`, `MetaCard`, `HealthChatBubble`, `FinanceChart`, `AgendaItem`, `ProfileCard`).  
5. Privacy: Single-user per device by design; provide explicit export/import backup flows.

## Development Workflow & Quality Gates
- All features MUST include a `spec.md` with prioritized user stories and an independent test for each P1 story.  
- Unit tests for ViewModels and domain logic are REQUIRED before merging.  
- Integration tests for DB migrations, notification scheduling, and AI inference are REQUIRED.  
- Pull requests MUST include a short constitution compliance checklist referencing the relevant principle(s).  
- Changes that break principle guarantees require a documented migration and a MAJOR version bump.

## Governance
Amendments: Minor clarifications or wording fixes → PATCH (e.g., 1.0.1). New principles or material expansions → MINOR (e.g., 1.1.0). Removals or redefinitions of principles → MAJOR.  
Amendment process: propose change in a PR with rationale, identify impacted artifacts, run `Constitution Check` (see plan-template), and obtain approval from project maintainers (minimum 2 approvers) before merging.  
Compliance Review: Each release MUST run automated checks mapping code to principles (tests and linters). Non-technical policies (privacy, export formats) require documentation updates and a manual acceptance test.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2025-12-22
