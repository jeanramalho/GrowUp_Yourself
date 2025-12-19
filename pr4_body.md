Title: feat(spec): progressCalculator service (SPEC-004)

Description:
- Adds progressCalculator stub and unit test placeholder.
- Will be consumed by HeaderProgress to display monthly progress per pillar.

Checklist:
- [ ] Implement getMonthlyProgress algorithm (weeks partial weighting)
- [ ] Add unit tests verifying example [100,75,50,100] => 81.25
- [ ] Integrate with HeaderProgress component
Specs: SPEC-004
Labels: spec/MVP, priority/high
