---
title: Cypress E2E Tests Timing Out in TeamCity CI/CD Pipeline
ticket: N/A
component: ng_site_radar
category: testing-issue
test-type: e2e
severity: high
date: 2025-10-01
resolved: no
environment: ci-cd
---

# Cypress E2E Tests Timing Out in TeamCity CI/CD Pipeline

> **CI/CD-specific Cypress test failures that are not reproducible in local development environments**

## Samenvatting

**Eén-zin beschrijving**: Cypress E2E tests for process contour management and action linking consistently fail in TeamCity CI/CD builds with page load timeouts and element not found errors, but pass reliably in local development environments.

## Test Details

### Test Information - Issue 1: Process Test Timeout

- **Test Suite**: `proces related tests`
- **Test Name**: `Disconnect and Connect Contour`
- **Test File**: `ng_site_radar/src/front/src/e2e-tests/proces.spec.e2e.ts:88`
- **Test Type**: E2E (Cypress)
- **Testing Framework**: Cypress

### Test Information - Issue 2: Action Test Element Not Found

- **Test Suite**: `acties`
- **Test Name**: `can add a new koppeling`
- **Test File**: `ng_site_radar/src/front/src/e2e-tests/acties.spec.e2e.ts:133`
- **Test Type**: E2E (Cypress)
- **Testing Framework**: Cypress

### Environment Information

- **Where it fails**: TeamCity CI/CD Pipeline (Build #2025.79)
- **Where it passes**: Local development environments
- **Reproducibility**: Consistently fails in CI/CD, never fails locally

## Symptomen

### Error Messages - Issue 1: Process Test

```
CypressError: Timed out after waiting `60000ms` for your remote page to load.

Your page did not fire its `load` event within `60000ms`.

You can try increasing the `pageLoadTimeout` value in `cypress.config.js` to wait longer.

Browsers will not fire the `load` event until all stylesheets and scripts are done downloading.

When this `load` event occurs, Cypress will continue running commands.

  at <unknown> (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:196913:88)
  at tryCatcher (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:9281:23)
  at Promise._settlePromiseFromHandler (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:7216:31)
  at Promise._settlePromise (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:7273:18)
  at Promise._settlePromise0 (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:7318:10)
  at Promise._settlePromises (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:7398:18)
  at _drainQueueStep (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:4032:12)
  at _drainQueue (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:4025:9)
  at Async.../../node_modules/bluebird/js/release/async.js.Async._drainQueues (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:4041:5)
  at Async.drainQueues (https://dv-radar.districtxp.gent/__cypress/runner/cypress_runner.js:3911:14)
```

**Timestamp**: 2025-10-01 11:52:08
**Build**: TeamCity #2025.79

### Error Messages - Issue 2: Action Test

```
Timed out retrying after 10000ms: Expected to find element: `#radio-new-actie-input`, but never found it.
    at Context.eval (webpack://radar/./src/e2e-tests/acties.spec.e2e.ts:133:11)
```

**Timestamp**: 2025-10-01 11:29:59
**Build**: TeamCity #2025.79 (earlier attempt)

## Reproduction Steps

### Lokale Reproductie

**Issue 1 (Process Test)**:
1. Run `npm run cypress:open` in `ng_site_radar/src/front/`
2. Navigate to `proces.spec.e2e.ts`
3. Run test: "Disconnect and Connect Contour"
4. **Expected**: Test passes locally
5. **Actual**: Test passes locally ✅ (issue not reproducible)

**Issue 2 (Action Test)**:
1. Run `npm run cypress:open` in `ng_site_radar/src/front/`
2. Navigate to `acties.spec.e2e.ts`
3. Run test: "can add a new koppeling"
4. **Expected**: Test passes locally
5. **Actual**: Test passes locally ✅ (issue not reproducible)

### CI/CD Reproduction

- **Build Number**: #2025.79
- **Build Date/Time**: 2025-10-01 11:29:59 (first failure), 11:52:08 (second failure)
- **Build Configuration**: TeamCity CI/CD Pipeline
- **Build Environment**: TeamCity agent with automated Cypress execution
- **Reproducibility in CI/CD**: Consistent failures

## Root Cause Analysis

### Hypotheses

1. **Hypothesis 1: Page Load Performance in CI/CD Environment**
   - **Evidence**: 60-second timeout suggests page never completes loading
   - **Likelihood**: High
   - **Details**: CI/CD environment may have slower network, CPU, or memory resources affecting initial page load times for complex Angular/GIS application

2. **Hypothesis 2: Resource Loading Delays (Stylesheets/Scripts)**
   - **Evidence**: Cypress error explicitly mentions "Browsers will not fire the load event until all stylesheets and scripts are done downloading"
   - **Likelihood**: High
   - **Details**: Large bundle sizes (55-60MB) combined with CI/CD network conditions may delay resource loading

3. **Hypothesis 3: Angular Hydration/Bootstrap Timing**
   - **Evidence**: Element `#radio-new-actie-input` not found after 10 seconds
   - **Likelihood**: Medium
   - **Details**: Angular application bootstrap may be slower in CI/CD, causing DOM elements to not be available when Cypress expects them

4. **Hypothesis 4: OpenLayers Map Initialization Delays**
   - **Evidence**: Both failing tests involve complex pages with map/contour functionality
   - **Likelihood**: Medium
   - **Details**: OpenLayers initialization with Belgian Lambert 72 projection may be resource-intensive in CI/CD

5. **Hypothesis 5: SignalR Connection Timeout**
   - **Evidence**: Real-time features may be attempting to establish connections
   - **Likelihood**: Medium
   - **Details**: SignalR connection establishment may timeout or delay page load events

6. **Hypothesis 6: Test Data Dependencies**
   - **Evidence**: Tests use specific IDs (dossier 49955, proces 58873, contour 55076, actie 56064)
   - **Likelihood**: Low
   - **Details**: Test data may not be available or properly seeded in CI/CD environment

### Confirmed Root Cause (indien bekend)

**Status**: Under investigation - Root cause not yet confirmed

Most likely contributing factors based on error patterns:
- **Page load timeout (Issue 1)**: Combination of large bundle size, resource loading delays, and CI/CD resource constraints
- **Element not found (Issue 2)**: Angular component rendering timing mismatch between local and CI/CD environments

## Environment Differences

### Local vs CI/CD

| Aspect | Local | CI/CD |
|--------|-------|-------|
| OS | Developer workstation (Windows/Mac) | TeamCity agent (likely Linux/Windows Server) |
| Browser/Version | Chrome (latest, developer installed) | Chrome (CI/CD managed version) |
| Network | High-speed local/office network | CI/CD internal network (may have restrictions) |
| Resources (CPU/Memory) | Developer machine (varies) | Shared TeamCity agent resources |
| Parallelization | Single test run | Potentially parallel test execution |
| Test Data | Local database/API | CI/CD test environment (dv-radar.districtxp.gent) |
| Services/Dependencies | Local services | Remote DV environment services |
| Bundle Serving | Local dev server with HMR | Built static assets served via web server |

### Specific Configuration Issues

- **Bundle Size**: 55-60MB bundles may load slower in CI/CD network
- **Memory Allocation**: Node process requires 8GB memory for builds - CI/CD may have constraints
- **Page Load Timeout**: Default 60-second timeout may be insufficient for CI/CD environment
- **Element Wait Timeout**: Default 10-second timeout may be insufficient for complex component rendering

## Code Context

### Test Code - Issue 1: Process Test

```typescript
// File: ng_site_radar/src/front/src/e2e-tests/proces.spec.e2e.ts:84-101

it('Disconnect and Connect Contour', () => {
    RadarTestHelper.interceptApiCall(`${RadarTestHelper.apiUrl()}/case/58873/ontkoppel/contour`, 'PUT').as('apiOntkoppelContour');
    RadarTestHelper.interceptApiCall(`${RadarTestHelper.apiUrl()}/contour/55076/koppel`, 'PUT').as('apiKoppelContour');

    // THIS LINE TIMES OUT IN CI/CD
    cy.visit(`${RadarTestHelper.radarUrl()}/dossiers/49955/processen/58873/contouren`);

    // We disconnect and connect 2 different contouren cause the test does not change state in the API
    // Ontkoppel
    cy.get('#link_54484 > .icon > .fas').click();
    cy.wait('@apiOntkoppelContour').should('exist');

    // Koppel
    cy.get('#link_55076 > .icon > .fas').click();
    // Koppel triggers a dialog that we confirm here (without filling in anything)
    cy.get('.mat-mdc-dialog-actions > .is-primary > span').click();
    cy.wait('@apiKoppelContour').should('exist');
});
```

**Issue**: The `cy.visit()` call times out waiting for page load event

### Test Code - Issue 2: Action Test

```typescript
// File: ng_site_radar/src/front/src/e2e-tests/acties.spec.e2e.ts:122-154

it('can add a new koppeling', () => {
    RadarTestHelper.interceptApiCallWithFixture(
        `${RadarTestHelper.apiUrl()}/werktaak/-9999/koppel`,
        'PUT',
        'cypress/fixtures/api/werktaak/-9999/koppel.fixture.json')
        .as('apiKoppelActie');

    cy.visit(`${RadarTestHelper.radarUrl()}/dossiers/66732/acties/56064/info`);

    cy.get('.tabs > ul > :nth-child(5) > a').click();
    cy.get('.material-icons').click();
    cy.get('.mat-mdc-menu-content > :nth-child(1)').click();

    // THIS LINE FAILS - ELEMENT NOT FOUND IN CI/CD
    cy.get('#radio-new-actie-input').check();

    cy.get('#actie-type').select(1);

    // ... rest of test
});
```

**Issue**: Element `#radio-new-actie-input` is not found within 10-second timeout

### Application Code (indirect context)

Both tests involve complex Angular pages with:
- **NgRx state management** (async state loading)
- **OpenLayers maps** (resource-intensive initialization)
- **Angular Material dialogs** (dynamic DOM manipulation)
- **SignalR real-time connections** (async connection establishment)
- **Large component trees** (multiple lazy-loaded feature modules)

## Oplossing

### Immediate Fix ✅

**Status**: No immediate fix implemented yet

**Proposed Solutions**:

#### Option 1: Increase Cypress Timeouts for CI/CD

```typescript
// File: ng_site_radar/src/front/cypress.config.ts

export default defineConfig({
  e2e: {
    // Increase page load timeout from default 60s to 120s for CI/CD
    pageLoadTimeout: 120000,

    // Increase default command timeout from 10s to 20s
    defaultCommandTimeout: 20000,

    // Increase element existence timeout
    requestTimeout: 20000,
  }
});
```

**Waarom dit werkt**:
- Allows more time for resource loading in slower CI/CD environment
- Accommodates bundle size and complex page initialization
- Aligns timeouts with actual CI/CD performance characteristics

**Nadelen**:
- Longer timeouts mean slower test feedback on actual failures
- Doesn't address root cause of slow page loads
- May hide performance regressions

#### Option 2: Add Explicit Wait Conditions

```typescript
// File: ng_site_radar/src/front/src/e2e-tests/proces.spec.e2e.ts

it('Disconnect and Connect Contour', () => {
    RadarTestHelper.interceptApiCall(`${RadarTestHelper.apiUrl()}/case/58873/ontkoppel/contour`, 'PUT').as('apiOntkoppelContour');
    RadarTestHelper.interceptApiCall(`${RadarTestHelper.apiUrl()}/contour/55076/koppel`, 'PUT').as('apiKoppelContour');

    cy.visit(`${RadarTestHelper.radarUrl()}/dossiers/49955/processen/58873/contouren`);

    // ADDED: Wait for specific Angular component to be ready
    cy.get('[data-cy=contour-list]', { timeout: 30000 }).should('be.visible');

    // ADDED: Wait for map to be initialized (if applicable)
    cy.get('.ol-viewport', { timeout: 30000 }).should('exist');

    // Ontkoppel
    cy.get('#link_54484 > .icon > .fas').click();
    cy.wait('@apiOntkoppelContour').should('exist');

    // ... rest of test
});
```

```typescript
// File: ng_site_radar/src/front/src/e2e-tests/acties.spec.e2e.ts

it('can add a new koppeling', () => {
    // ... setup code ...

    cy.visit(`${RadarTestHelper.radarUrl()}/dossiers/66732/acties/56064/info`);

    cy.get('.tabs > ul > :nth-child(5) > a').click();
    cy.get('.material-icons').click();
    cy.get('.mat-mdc-menu-content > :nth-child(1)').click();

    // ADDED: Wait for dialog animation to complete
    cy.get('.mat-mdc-dialog-container', { timeout: 15000 }).should('be.visible');

    // ADDED: Wait for dialog content to be fully rendered
    cy.get('.mat-mdc-dialog-content', { timeout: 10000 }).should('exist');

    // Now check the radio button
    cy.get('#radio-new-actie-input', { timeout: 15000 }).check();

    // ... rest of test
});
```

**Waarom dit werkt**:
- Explicitly waits for critical UI elements before proceeding
- More resilient to timing variations between environments
- Better test pattern than implicit waits

**Nadelen**:
- Requires test code changes
- Need to identify correct elements to wait for
- More verbose test code

#### Option 3: Optimize Page Load with Test-Specific Configuration

```typescript
// File: ng_site_radar/src/front/src/environments/environment.cypress.ts

export const environment = {
  production: false,
  // Disable non-essential features during E2E tests
  enableSignalR: false,  // Disable real-time features
  enableAPM: false,      // Disable Elastic APM monitoring
  enableAnalytics: false,
  // ... other optimizations
};
```

**Waarom dit werkt**:
- Reduces unnecessary overhead during tests
- Faster page loads and component initialization
- More focused testing environment

**Nadelen**:
- Tests don't run against "real" configuration
- May miss integration issues
- Requires application code changes

### Workarounds (indien permanent fix niet mogelijk)

1. **Workaround 1: Retry Failed Tests in CI/CD**
   - Configure TeamCity to automatically retry failed E2E tests once
   - Hoe implementeren: TeamCity build configuration setting
   - Nadelen: Increases build time, may hide flakiness issues

2. **Workaround 2: Run Problematic Tests Separately**
   - Move slow/problematic tests to separate suite with higher timeouts
   - Hoe implementeren: Create `cypress.slow.config.ts` with increased timeouts
   - Nadelen: Test suite fragmentation, more complex CI/CD pipeline

## Preventie Strategie

### Test Stabiliteit Checklist

Wanneer je E2E/Integration tests schrijft voor complex Angular/GIS application:

- [ ] **Use explicit waits**: Always wait for specific elements/conditions rather than relying on implicit timing
- [ ] **Avoid hard-coded delays**: Never use `cy.wait(5000)` - use `cy.wait('@apiCall')` or conditional waits
- [ ] **Wait for Angular stability**: Ensure Angular has completed change detection before assertions
- [ ] **Wait for map initialization**: If test involves OpenLayers, wait for map container to be ready
- [ ] **Test selectors are robust**: Use `data-cy` attributes instead of fragile CSS selectors
- [ ] **Account for animations**: Wait for Material dialog animations to complete
- [ ] **Mock external dependencies**: Use Cypress intercepts for API calls
- [ ] **Ensure test data availability**: Verify test data exists before running tests
- [ ] **Add timeout extensions for heavy pages**: Complex pages may need longer timeouts in CI/CD

### CI/CD Best Practices

- [ ] **Environment-specific timeouts**: Configure longer timeouts for CI/CD than local
- [ ] **Resource allocation**: Ensure CI/CD agents have adequate CPU/memory for large Angular builds
- [ ] **Test data seeding**: Automate test data setup in CI/CD pipeline
- [ ] **Parallel execution consideration**: Account for resource contention if tests run in parallel
- [ ] **Retry mechanism**: Configure automatic retry for flaky E2E tests (max 1 retry)
- [ ] **Video recording**: Enable Cypress video recording in CI/CD for failure analysis
- [ ] **Screenshot on failure**: Capture screenshots to debug timing issues

### Test Improvements

Concrete verbeteringen om herhaling te voorkomen:
1. **Add `data-cy` attributes**: Update application components to include stable test selectors
2. **Create test helper for page readiness**: Centralize logic for waiting for Angular/OpenLayers/Material to be ready
3. **Environment-specific Cypress config**: Create separate config for CI/CD with appropriate timeouts
4. **Performance monitoring**: Add build metrics to track page load times in CI/CD over time

## Flakiness Analysis (indien van toepassing)

### Flakiness Metrics

- **Failure Rate**: 100% in CI/CD Build #2025.79 (both tests failed)
- **First Seen**: 2025-10-01 (documented date, may have occurred earlier)
- **Pattern**: Environment-based (CI/CD only, not local)

### Contributing Factors

1. **Factor 1: CI/CD Environment Performance**
   - Slower network/CPU/memory resources in CI/CD compared to local
   - Large bundle sizes (55-60MB) exacerbate timing differences

2. **Factor 2: Complex Page Initialization**
   - Angular bootstrapping + OpenLayers + SignalR + Material dialogs
   - Multiple async operations must complete before page is "ready"

3. **Factor 3: Implicit Timeout Assumptions**
   - Tests written with local development timing in mind
   - Default Cypress timeouts insufficient for CI/CD environment

## Impact

### Development Impact

- **Test Reliability**: CI/CD E2E tests are currently unreliable, reducing confidence in build results
- **CI/CD Blockage**: Failed tests block successful build completion and deployment pipeline
- **Developer Time**: Developers must investigate failures, re-run builds, potentially multiple times
- **False Positives**: These are false failures - application functionality is not broken

### Risk Assessment

- **Severity**: High - Blocks CI/CD pipeline
- **Urgency**: High - Immediate investigation required
- **Risk if not fixed**:
  - Eroded confidence in test suite
  - Developers may ignore/skip E2E tests
  - Deployment delays
  - Potential to mask real failures if tests are disabled

## Betrokken Files

### Test Files

- `ng_site_radar/src/front/src/e2e-tests/proces.spec.e2e.ts:84-101` - Process contour test with page load timeout
- `ng_site_radar/src/front/src/e2e-tests/acties.spec.e2e.ts:122-154` - Action koppeling test with element not found

### Configuration Files

- `ng_site_radar/src/front/cypress.config.ts` - Cypress configuration with timeout settings
- `ng_site_radar/src/front/src/environments/environment.*.ts` - Environment-specific Angular configuration
- `ng_site_radar/src/front/angular.json` - Build configuration with bundle budgets

### Application Files (Affected Pages)

- `ng_site_radar/src/front/src/app-newarch/**/proces/**` - Process management components
- `ng_site_radar/src/front/src/app-newarch/**/actie/**` - Action management components
- `ng_site_radar/src/front/src/app-newarch/**/contour/**` - Contour management components

## Build/CI Information

### Build Details

- **CI/CD System**: TeamCity
- **Build Number**: #2025.79
- **Build Date**: 2025-10-01
- **Test Failures**:
  - 11:29:59 - `acties > can add a new koppeling` (element not found)
  - 11:52:08 - `proces related tests > Disconnect and Connect Contour` (page load timeout)

### Related Builds

- Build #2025.79 - Both test failures documented here
- Previous builds - Status unknown (need historical build analysis)

## Investigation Timeline

| Datum | Activiteit | Resultaat | Investigator |
|-------|-----------|-----------|--------------|
| 2025-10-01 11:29:59 | First failure detected | Action test failed - element not found | TeamCity |
| 2025-10-01 11:52:08 | Second failure detected | Process test failed - page load timeout | TeamCity |
| 2025-10-01 | Issue documented | Documentation created, investigation ongoing | Development Team |

## Lessons Learned

### Voor Test Development

- **Les 1**: **Environment Parity is Critical** - Tests that pass locally but fail in CI/CD indicate environment differences that must be explicitly handled
- **Les 2**: **Default Timeouts May Be Insufficient** - Large Angular/GIS applications with 55-60MB bundles require environment-specific timeout configuration
- **Les 3**: **Explicit Waits Over Implicit Timing** - Tests should explicitly wait for specific conditions (API calls, elements visible, animations complete) rather than assuming page readiness

### Voor CI/CD Pipeline

- **Les 1**: **Resource Allocation for Heavy Apps** - Angular applications with large bundles and complex initialization need adequate CPU/memory in CI/CD agents
- **Les 2**: **Environment-Specific Test Configuration** - CI/CD should use different Cypress configuration than local development
- **Les 3**: **Failure Diagnostics** - Enable video recording and screenshots in CI/CD to diagnose timing issues

### Voor Team

- **Process Improvement**: Establish baseline performance metrics for page load times in CI/CD
- **Communication**: Document environment-specific test requirements and known timing sensitivities
- **Testing Strategy**: Consider if all E2E tests need to run in CI/CD or if some can be moved to scheduled/on-demand runs

## Gerelateerde Issues

### Similar Test Failures

- *To be added as more CI/CD test issues are documented*

### Related Features

- [Angular Frontend (ng_site_radar)](../../applications/ng_site_radar/README.md) - E2E testing setup and configuration
- *Contour Management Feature* - (to be documented) - Geographic boundary management functionality
- *Process Management Feature* - (to be documented) - Municipal process workflow functionality

## External Resources

- [Cypress: Timeouts](https://docs.cypress.io/guides/references/configuration#Timeouts) - Official documentation on timeout configuration
- [Cypress: Best Practices](https://docs.cypress.io/guides/references/best-practices) - Testing best practices
- [Cypress: Network Requests](https://docs.cypress.io/guides/guides/network-requests) - Using `cy.wait()` with intercepted requests
- [Angular: Testing](https://angular.dev/guide/testing) - Angular testing documentation
- [TeamCity: Build Failure Conditions](https://www.jetbrains.com/help/teamcity/build-failure-conditions.html) - CI/CD configuration

## Status & Follow-up

### Current Status

- **Resolved**: Nee
- **Workaround Available**: Nee (under investigation)
- **Permanent Fix Needed**: Ja
- **Tests Passing**: Failing in CI/CD, passing locally

### Monitoring

- [ ] Monitor Build #2025.80+ success rate
- [ ] Track page load times in CI/CD environment
- [ ] Compare local vs CI/CD performance metrics
- [ ] Review historical build data for pattern analysis

### Follow-up Actions

- [ ] **Priority 1**: Implement increased timeouts in Cypress config for CI/CD (quick win)
- [ ] **Priority 2**: Add explicit wait conditions to failing tests
- [ ] **Priority 3**: Investigate page load performance in CI/CD environment
- [ ] **Priority 4**: Create test helper functions for common wait conditions
- [ ] **Priority 5**: Add `data-cy` attributes to critical test elements
- [ ] **Priority 6**: Consider environment-specific Cypress configuration
- [ ] **Priority 7**: Analyze resource allocation on TeamCity agents

### Toekomstige Verbeteringen

- **Verbetering 1**: **Cypress Test Helper Library** - Create centralized helpers for waiting on Angular/OpenLayers/Material readiness (Effort: 4-8 hours)
- **Verbetering 2**: **CI/CD Performance Baseline** - Establish performance monitoring for page load times in CI/CD (Effort: 2-4 hours)
- **Verbetering 3**: **Test Data Management** - Automate test data seeding and validation in CI/CD pipeline (Effort: 8-16 hours)
- **Verbetering 4**: **Selective E2E Testing** - Implement test categorization to run critical tests in CI/CD and full suite on-demand (Effort: 4-8 hours)

## Change Log

| Datum | Update | Ticket |
|-------|--------|--------|
| 2025-10-01 | Initiële documentatie van CI/CD failures | N/A |

---

**Laatste update**: 2025-10-01
**Status**: Open - Under Investigation
**Documentatie door**: Development Team
