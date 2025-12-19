Title: feat(spec): meta execution & notifications (SPEC-003)

Description:
- Adds injectable notifications service and stubbed metaExecutionUseCases to schedule end notifications when a meta is started.
- Expected to be integrated with DAO/usecases from SPEC-002.

Checklist:
- [ ] Implement persistence of execucao and scheduling logic
- [ ] Add unit tests for final time calculation
- [ ] Add integration tests mocking notification scheduler
Specs: SPEC-003
Labels: spec/MVP, priority/high
