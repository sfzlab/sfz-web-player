import { describe, it, expect, vi, beforeEach } from 'vitest';
import Player from '../../src/components/Player';
import Audio from '../../src/components/Audio';
import Editor from '../../src/components/Editor';
import Interface from '../../src/components/Interface';

// Mock the components
vi.mock('../../src/components/Audio');
vi.mock('../../src/components/Editor');
vi.mock('../../src/components/Interface');

describe('Player Component', () => {
  let mockAudio: any;
  let mockEditor: any;
  let mockInterface: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock instances
    mockAudio = {
      addEvent: vi.fn(),
      update: vi.fn(),
      reset: vi.fn(),
      loader: { addFile: vi.fn(), getFile: vi.fn() },
    };

    mockEditor = {
      addEvent: vi.fn(),
      getEl: vi.fn(() => document.createElement('div')),
      loader: { addFile: vi.fn(), getFile: vi.fn() },
    };

    mockInterface = {
      addEvent: vi.fn(),
      getEl: vi.fn(() => document.createElement('div')),
      setLoadingState: vi.fn(),
      setLoadingText: vi.fn(),
      setKeyboard: vi.fn(),
      setKeyboardMap: vi.fn(),
      reset: vi.fn(),
      loader: { addFile: vi.fn(), getFile: vi.fn() },
    };

    // Mock constructors
    (Audio as any).mockImplementation(() => mockAudio);
    (Editor as any).mockImplementation(() => mockEditor);
    (Interface as any).mockImplementation(() => mockInterface);
  });

  it('should create player with audio component', () => {
    const options = {
      audio: { root: 'test' },
      interface: { root: 'test' },
      editor: { root: 'test' },
    };

    const player = new Player('test-player', options);

    expect(player).toBeDefined();
    expect(Audio).toHaveBeenCalledWith(
      expect.objectContaining({
        loader: expect.any(Object),
        root: 'test',
      })
    );
  });

  it('should create player with interface component', () => {
    const options = {
      interface: { root: 'test' },
    };

    const player = new Player('test-player', options);

    expect(player).toBeDefined();
    expect(Interface).toHaveBeenCalledWith(
      expect.objectContaining({
        loader: expect.any(Object),
        root: 'test',
      })
    );
  });

  it('should create player with editor component', () => {
    const options = {
      editor: { root: 'test' },
    };

    const player = new Player('test-player', options);

    expect(player).toBeDefined();
    expect(Editor).toHaveBeenCalledWith(
      expect.objectContaining({
        loader: expect.any(Object),
        root: 'test',
      })
    );
  });

  it('should handle audio events correctly', () => {
    const options = {
      audio: { root: 'test' },
      interface: { root: 'test' },
    };

    const player = new Player('test-player', options);

    // Simulate audio change event
    const mockEvent = { data: { note: 60, velocity: 100 } };
    const audioEventCallback = mockAudio.addEvent.mock.calls.find((call) => call[0] === 'change')?.[1];

    if (audioEventCallback) {
      audioEventCallback(mockEvent);
    }

    expect(mockInterface.setKeyboard).toHaveBeenCalledWith(mockEvent.data);
  });

  it('should handle keyboard map events correctly', () => {
    const options = {
      audio: { root: 'test' },
      interface: { root: 'test' },
    };

    const player = new Player('test-player', options);

    // Simulate keyboard map event
    const mockKeyboardMap = { 60: true, 61: true };
    const keyboardMapEventCallback = mockAudio.addEvent.mock.calls.find((call) => call[0] === 'keyboardMap')?.[1];

    if (keyboardMapEventCallback) {
      keyboardMapEventCallback({ data: mockKeyboardMap });
    }

    expect(mockInterface.setKeyboardMap).toHaveBeenCalledWith(mockKeyboardMap);
  });
});
