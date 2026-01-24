import Audio from '../src/components/Audio';
import { VoiceManager } from '../src/components/VoiceManager';
import { Voice, ADSREnvelope } from '../src/components/Voice';
import { SFZEngine } from '../src/components/SFZEngine';

describe('SFZ Web Audio Engine', () => {
  let mockAudioContext: any;
  let mockAudioBuffer: any;

  beforeEach(() => {
    // Mock AudioContext
    mockAudioContext = {
      sampleRate: 44100,
      currentTime: 0,
      createBufferSource: jest.fn(() => ({
        buffer: null,
        playbackRate: { value: 1 },
        loop: false,
        loopStart: 0,
        loopEnd: 0,
        start: jest.fn(),
        stop: jest.fn(),
        connect: jest.fn(),
        disconnect: jest.fn()
      })),
      createGain: jest.fn(() => ({
        gain: { value: 1, setValueAtTime: jest.fn() },
        connect: jest.fn(),
        disconnect: jest.fn()
      })),
      createBiquadFilter: jest.fn(() => ({
        type: 'lowpass',
        frequency: { value: 1000 },
        Q: { value: 1 },
        connect: jest.fn(),
        disconnect: jest.fn()
      })),
      createStereoPanner: jest.fn(() => ({
        pan: { value: 0 },
        connect: jest.fn(),
        disconnect: jest.fn()
      })),
      destination: { connect: jest.fn() }
    };

    mockAudioBuffer = {
      length: 44100,
      sampleRate: 44100,
      numberOfChannels: 2
    };

    // Mock global AudioContext
    (global as any).AudioContext = jest.fn(() => mockAudioContext);
    (global as any).window = { AudioContext: (global as any).AudioContext };
  });

  describe('ADSREnvelope', () => {
    it('should create envelope with correct parameters', () => {
      const envelope = new ADSREnvelope(44100);
      envelope.setADSR(0.1, 0.2, 0.7, 0.3);
      
      expect(envelope.isActive()).toBe(false);
      
      envelope.trigger();
      expect(envelope.isActive()).toBe(true);
      
      // Process some samples
      for (let i = 0; i < 100; i++) {
        envelope.process();
      }
      
      envelope.startRelease();
      expect(envelope.isReleased()).toBe(true);
    });
  });

  describe('SFZEngine', () => {
    it('should calculate pitch modulation correctly', () => {
      const engine = new SFZEngine(mockAudioContext);
      
      const region = {
        pitch_keycenter: 60,
        transpose: 12,
        tune: 50,
        pitch_keytrack: 1
      };
      
      const pitchCents = engine.calculatePitchModulation(region, 72, 0.8, 0);
      expect(pitchCents).toBeGreaterThan(1200); // Should be more than an octave
    });

    it('should calculate crossfade correctly', () => {
      const engine = new SFZEngine(mockAudioContext);
      
      const region = {
        xfin_lovel: 0,
        xfin_hivel: 64,
        xfout_lovel: 64,
        xfout_hivel: 127
      };
      
      const xfade1 = engine.calculateCrossfade(region, 32, 60); // Should fade in
      const xfade2 = engine.calculateCrossfade(region, 96, 60); // Should fade out
      
      expect(xfade1).toBeGreaterThan(0);
      expect(xfade1).toBeLessThan(1);
      expect(xfade2).toBeGreaterThan(0);
      expect(xfade2).toBeLessThan(1);
    });
  });

  describe('Voice', () => {
    it('should start and stop voice correctly', () => {
      const voice = new Voice(mockAudioContext);
      
      const region = {
        sample: 'test.wav',
        ampeg_attack: 10,
        ampeg_decay: 100,
        ampeg_sustain: 0.7,
        ampeg_release: 200,
        loop_mode: 'one_shot'
      };
      
      const event = {
        channel: 1,
        note: 60,
        velocity: 0.8
      };
      
      const result = voice.startVoice(region, mockAudioBuffer, event);
      expect(result).toBe(true);
      expect(voice.isActive()).toBe(true);
      
      voice.handleNoteOff(60);
      expect(voice.getTriggerEvent()?.note).toBe(60);
      
      voice.stop();
      expect(voice.isFree()).toBe(true);
    });
  });

  describe('VoiceManager', () => {
    it('should manage voice allocation correctly', () => {
      const voiceManager = new VoiceManager(mockAudioContext, 4);
      
      const region = {
        sample: 'test.wav',
        loop_mode: 'one_shot'
      };
      
      const event = {
        channel: 1,
        note: 60,
        velocity: 0.8
      };
      
      // Trigger multiple voices
      const voice1 = voiceManager.triggerVoice(region, mockAudioBuffer, event);
      const voice2 = voiceManager.triggerVoice(region, mockAudioBuffer, { ...event, note: 61 });
      
      expect(voice1).toBeTruthy();
      expect(voice2).toBeTruthy();
      expect(voiceManager.getActiveVoiceCount()).toBe(2);
      
      voiceManager.noteOff(60);
      voiceManager.stopAll();
      expect(voiceManager.getActiveVoiceCount()).toBe(0);
    });
  });
});