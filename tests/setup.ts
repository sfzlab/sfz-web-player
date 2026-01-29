// Vitest setup file
import { vi } from 'vitest';

// Mock browser-fs-access for testing
vi.mock('browser-fs-access', () => ({
  directoryOpen: vi.fn(),
}));

// Mock @sfz-tools/core for testing
vi.mock('@sfz-tools/core', () => ({
  parseSfz: vi.fn(),
  parseHeaders: vi.fn(),
}));

// Mock web audio API for testing
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: function AudioContext() {
    return {
      createBufferSource: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        buffer: null,
        playbackRate: { value: 1 },
      })),
      createGain: vi.fn(() => ({
        connect: vi.fn(),
        gain: { value: 1, linearRampToValueAtTime: vi.fn() },
      })),
      createBiquadFilter: vi.fn(() => ({
        connect: vi.fn(),
        frequency: { value: 1000 },
        Q: { value: 1 },
      })),
      createOscillator: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        type: 'sine',
        frequency: { value: 440 },
      })),
      destination: {},
      currentTime: 0,
    };
  },
});

// Mock webaudio-controls if needed
if (typeof window !== 'undefined') {
  (window as any).webAudioControlsWidgetManager = {
    addMidiListener: vi.fn(),
  };
}
