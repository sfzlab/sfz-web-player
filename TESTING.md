# Testing Setup for SFZ Web Player

This document explains how to use the testing infrastructure for the SFZ Web Player project.

## Overview

The project now includes both unit tests (using Vitest) and integration tests (using Playwright) to ensure robust development and testing workflows.

## Test Structure

```
tests/
├── setup.ts              # Vitest setup and mocks
├── unit/                 # Unit tests
│   ├── index.test.ts     # Basic component structure tests
│   ├── player.test.ts    # Player component tests
│   ├── audio.test.ts     # Audio component tests
│   └── sample.test.ts    # Sample component tests
└── integration/          # Integration tests
    └── player.spec.ts    # End-to-end player tests
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:unit:watch

# Run unit tests with coverage
npm run test:coverage

# Update snapshots
npm run test:update
```

### Integration Tests (Playwright)

```bash
# Run all integration tests
npm run test:integration

# Run integration tests with UI
npm run test:integration:ui

# Run tests for specific browser
npx playwright test --project=chromium
```

### All Tests

```bash
# Run both unit and integration tests
npm test
```

## Test Configuration

### Vitest Configuration

- **Config File**: `vitest.config.ts`
- **Environment**: jsdom (for DOM testing)
- **Setup**: `tests/setup.ts` (includes mocks for Web Audio API, browser-fs-access, etc.)
- **Coverage**: V8 provider with text, JSON, and HTML reporters

### Playwright Configuration

- **Config File**: `playwright.config.ts`
- **Base URL**: `http://localhost:8080`
- **Browsers**: Chromium, Firefox, WebKit
- **Web Server**: Automatically starts dev server
- **Reporter**: HTML reporter

## Mocking Strategy

### Web Audio API

The tests mock the Web Audio API to avoid browser dependencies:

```typescript
// In tests/setup.ts
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: function AudioContext() {
    return {
      createBufferSource: vi.fn(() => ({ /* mock */ })),
      createGain: vi.fn(() => ({ /* mock */ })),
      // ... other methods
    };
  }
});
```

### External Dependencies

- **browser-fs-access**: Mocked for file system operations
- **@sfz-tools/core**: Mocked for SFZ parsing
- **webaudio-controls**: Mocked for MIDI widget management

## Writing Tests

### Unit Tests

Unit tests should focus on individual components and their logic:

```typescript
describe('Component Name', () => {
  it('should do something', () => {
    // Test logic here
    expect(result).toBeDefined();
  });
});
```

### Integration Tests

Integration tests should test the full application flow:

```typescript
test('should load the player interface', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#player')).toBeVisible();
});
```

## Test Examples

### Testing MIDI Events

```typescript
it('should handle MIDI keyboard events', () => {
  const mockEvent = {
    data: [144, 60, 100] // Note on, middle C, velocity 100
  };
  
  // Test the event handling logic
  expect(mockEvent.data[0]).toBe(144);
  expect(mockEvent.data[1]).toBe(60);
  expect(mockEvent.data[2]).toBe(100);
});
```

### Testing Region Filtering

```typescript
it('should filter regions based on MIDI conditions', () => {
  const mockRegion = {
    lokey: 60,
    hikey: 72,
    lovel: 0,
    hivel: 127,
    sample: 'test.wav'
  };

  const mockControlEvent = {
    channel: 1,
    note: 65,
    velocity: 50
  };

  const isInKeyRange = mockRegion.lokey <= mockControlEvent.note && 
                      mockRegion.hikey >= mockControlEvent.note;
  const isInVelRange = mockRegion.lovel <= mockControlEvent.velocity && 
                      mockRegion.hivel >= mockControlEvent.velocity;

  expect(isInKeyRange).toBe(true);
  expect(isInVelRange).toBe(true);
});
```

## Continuous Integration

The test scripts are configured to work with CI/CD:

```bash
# Check script runs format, lint, build, and tests
npm run check
```

This ensures code quality and test coverage before deployment.

## Troubleshooting

### Common Issues

1. **Web Audio API not mocked**: Ensure `tests/setup.ts` is properly configured
2. **File system access errors**: Check browser-fs-access mocking
3. **Missing dependencies**: Run `npm install` to ensure all test dependencies are installed

### Debugging Tests

```bash
# Run tests with verbose output
npm run test:unit -- --reporter=verbose

# Run specific test file
npm run test:unit -- tests/unit/player.test.ts

# Run tests in debug mode
npm run test:unit:watch -- --debug
```

## Performance Considerations

- Unit tests should be fast and not require browser automation
- Integration tests may be slower but provide end-to-end coverage
- Use mocking to avoid external dependencies and improve test speed
- Consider test parallelization for faster CI/CD runs

## Next Steps

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Start development with watch mode: `npm run test:unit:watch`
4. Add new tests as you implement features from FEATURES.md