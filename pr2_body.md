Title: feat(spec): metas CRUD + migration (SPEC-002)

Description:
- Adds Meta model, DAO (stub), domain usecases and initial migration SQL (stub).
- Provides integration path for sqliteRepository abstraction.

Checklist:
- [ ] Implement sqliteRepository and wire DAO to it
- [ ] Add unit tests for metaUseCases and integration tests for DAO
- [ ] Validate migration on device/emulator
Specs: SPEC-002
Labels: spec/MVP, priority/high
