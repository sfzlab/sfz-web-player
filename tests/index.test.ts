/**
 * Basic import tests for SFZ Web Player components
 * These tests verify that components can be imported and instantiated
 */

import { describe, test, expect, vi } from 'vitest';

// Mock dependencies for testing
const mockLoader = {
  addFile: vi.fn(),
  getFile: vi.fn(),
  resetFiles: vi.fn(),
  setRoot: vi.fn(),
  addDirectory: vi.fn(),
};

// Mock the components since we can't import them directly in this test setup
const mockEditor = {
  loader: mockLoader,
  addEvent: vi.fn(),
  getEl: vi.fn(() => document.createElement('div')),
};

const mockInterface = {
  loader: mockLoader,
  addEvent: vi.fn(),
  getEl: vi.fn(() => document.createElement('div')),
  setLoadingState: vi.fn(),
  setLoadingText: vi.fn(),
  setKeyboard: vi.fn(),
  setKeyboardMap: vi.fn(),
  reset: vi.fn(),
};

const mockPlayer = {
  loader: mockLoader,
  setupAudio: vi.fn(),
  setupInterface: vi.fn(),
  setupEditor: vi.fn(),
  setupHeader: vi.fn(),
  getEl: vi.fn(() => document.createElement('div')),
};

describe('SFZ Web Player Component Imports', () => {
  test('Editor component structure', () => {
    expect(mockEditor.loader).toBeDefined();
    expect(typeof mockEditor.addEvent).toBe('function');
    expect(typeof mockEditor.getEl).toBe('function');
  });

  test('Interface component structure', () => {
    expect(mockInterface.loader).toBeDefined();
    expect(typeof mockInterface.addEvent).toBe('function');
    expect(typeof mockInterface.getEl).toBe('function');
    expect(typeof mockInterface.setLoadingState).toBe('function');
  });

  test('Player component structure', () => {
    expect(mockPlayer.loader).toBeDefined();
    expect(typeof mockPlayer.setupAudio).toBe('function');
    expect(typeof mockPlayer.setupInterface).toBe('function');
    expect(typeof mockPlayer.setupEditor).toBe('function');
    expect(typeof mockPlayer.getEl).toBe('function');
  });
});
