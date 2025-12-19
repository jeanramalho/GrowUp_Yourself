Stubs README

How to run tests for stubs (local development):

1. Install dependencies (if not already):

```bash
npm install
# or
yarn
```

2. Run Jest for tests in stubs (example):

```bash
# from repository root
npx jest stubs/__tests__ --runInBand
```

Notes:
- These files are placeholders (stubs). Replace implementations with production code.
- Design tokens should be replaced by extracting values from software_engineering/layout/v.1.2.
- i18n strings must be extended for full UI coverage.
