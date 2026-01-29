# SFZ Web Audio Player - Feature Requirements

This document outlines all the features required for a web audio SFZ player to achieve feature parity with the SFZ specification. Each feature includes technical requirements, Web Audio API specifications, sfizz implementation references, and edge cases.

## Table of Contents

1. [Core Audio Engine](#core-audio-engine)
2. [Envelope Generators](#envelope-generators)
3. [Low-Frequency Oscillators](#low-frequency-oscillators)
4. [Filters and Equalization](#filters-and-equalization)
5. [Modulation System](#modulation-system)
6. [Advanced Sample Features](#advanced-sample-features)
7. [MIDI Processing](#midi-processing)
8. [Effects Processing](#effects-processing)
9. [Performance Features](#performance-features)
10. [SFZ Specification Compliance](#sfz-specification-compliance)

## Core Audio Engine

### Voice Management
- **Feature**: Polyphonic voice allocation with intelligent voice stealing
- **SFZ Spec**: `polyphony`, `note_polyphony`, `off_by`, `off_mode`
- **Web Audio API**: Custom voice management using AudioBufferSourceNode lifecycle
- **sfizz Reference**: `Voice.cpp`, `VoiceManager.cpp`, `VoiceStealing.cpp`
- **Requirements**:
  - Maximum polyphony limits per region and globally
  - Voice stealing algorithms (oldest, quietest, newest)
  - Note polyphony limits for sustained sounds
  - Off-by groups for muting related voices
- **Edge Cases**:
  - Voice stealing when all voices are in use
  - Off-by groups with multiple regions
  - Rapid note triggering exceeding polyphony limits
  - Voice cleanup on audio context suspension

### Sample Playback Engine
- **Feature**: High-quality sample playback with precise timing
- **SFZ Spec**: `sample`, `offset`, `end`, `loop_mode`, `loop_start`, `loop_end`
- **Web Audio API**: AudioBufferSourceNode with precise scheduling
- **sfizz Reference**: `AudioReader.cpp`, `Sample.cpp`
- **Requirements**:
  - Support for WAV, FLAC, OGG, and other common formats
  - Precise sample positioning with sub-sample accuracy
  - Multiple loop modes (no_loop, loop_continuous, loop_sustain)
  - Loop crossfading for seamless transitions
  - Sample quality settings (interpolation methods)
- **Edge Cases**:
  - Loop points outside sample boundaries
  - Invalid loop configurations
  - Sample format compatibility issues
  - Memory management for large sample sets

### Oscillator Generation
- **Feature**: Built-in waveform generators for synthetic sounds
- **SFZ Spec**: `sample=*sine`, `sample=*saw`, `sample=*square`, `sample=*triangle`, `sample=*noise`
- **Web Audio API**: OscillatorNode with custom waveforms
- **sfizz Reference**: `Wavetables.cpp`, oscillator implementation in `Voice.cpp`
- **Requirements**:
  - Sine, sawtooth, square, triangle waveforms
  - White noise generation
  - Custom waveform support via PeriodicWave
  - Oscillator quality settings
- **Edge Cases**:
  - Oscillator frequency limits (avoiding aliasing)
  - Waveform generation performance
  - Oscillator synchronization

## Envelope Generators

### Amplitude Envelope (Ampeg)
- **Feature**: ADSR envelope for volume control
- **SFZ Spec**: `ampeg_attack`, `ampeg_decay`, `ampeg_sustain`, `ampeg_release`, `ampeg_hold`
- **Web Audio API**: GainNode automation with exponentialRampToValueAtTime
- **sfizz Reference**: `ADSREnvelope.cpp`, `amplitudeEG` in Region.h
- **Requirements**:
  - Attack, decay, sustain, release stages
  - Hold time support
  - Velocity to envelope depth modulation
  - Custom envelope shapes via curve parameters
- **Edge Cases**:
  - Zero attack/decay/release times
  - Sustain level of 0
  - Envelope retriggering during active notes
  - Very long envelope times

### Pitch Envelope
- **Feature**: ADSR envelope for pitch modulation
- **SFZ Spec**: `pitcheg_attack`, `pitcheg_decay`, `pitcheg_sustain`, `pitcheg_release`
- **Web Audio API**: AudioBufferSourceNode.playbackRate automation
- **sfizz Reference**: `pitchEG` in Region.h, pitch modulation in Voice.cpp
- **Requirements**:
  - Pitch modulation in cents
  - Velocity to pitch envelope depth
  - Pitch keytrack integration
  - Bend range compatibility
- **Edge Cases**:
  - Extreme pitch modulation ranges
  - Pitch envelope during note sustain
  - Interaction with other pitch sources

### Filter Envelope
- **Feature**: ADSR envelope for filter cutoff modulation
- **SFZ Spec**: `fileg_attack`, `fileg_decay`, `fileg_sustain`, `fileg_release`
- **Web Audio API**: BiquadFilterNode.frequency automation
- **sfizz Reference**: `filterEG` in Region.h, filter implementation
- **Requirements**:
  - Filter cutoff modulation
  - Velocity to filter envelope depth
  - Filter keytrack integration
  - Multiple filter types support
- **Edge Cases**:
  - Filter frequency limits
  - Envelope interaction with LFO
  - Filter resonance automation

### Flex Envelopes (SFZv2)
- **Feature**: Flexible envelopes with custom timing and curves
- **SFZ Spec**: `egN_attack`, `egN_decay`, `egN_delay`, `egN_hold`, `egN_release`, `egN_start`
- **Web Audio API**: Custom envelope implementation using scheduled automation
- **sfizz Reference**: `FlexEnvelope.cpp`, `FlexEGDescription.h`
- **Requirements**:
  - Multiple independent envelopes per voice
  - Custom timing parameters
  - Curve shape control
  - Looping envelope support
- **Edge Cases**:
  - Complex envelope interactions
  - Envelope timing precision
  - Memory usage for multiple envelopes

## Low-Frequency Oscillators

### Amplitude LFO
- **Feature**: LFO modulation of volume
- **SFZ Spec**: `amplfo_freq`, `amplfo_depth`, `amplfo_delay`
- **Web Audio API**: OscillatorNode + GainNode combination
- **sfizz Reference**: `amplitudeLFO` in Region.h, LFO implementation
- **Requirements**:
  - Sine, square, sawtooth, triangle waveforms
  - Frequency and depth control
  - Delay before LFO activation
  - CC modulation of LFO parameters
- **Edge Cases**:
  - Very low/high LFO frequencies
  - LFO depth exceeding 100%
  - LFO phase relationships

### Pitch LFO
- **Feature**: LFO modulation of pitch (vibrato)
- **SFZ Spec**: `pitchlfo_freq`, `pitchlfo_depth`, `pitchlfo_delay`
- **Web Audio API**: OscillatorNode modulating playbackRate
- **sfizz Reference**: `pitchLFO` in Region.h
- **Requirements**:
  - Pitch modulation in cents
  - Vibrato rate and depth control
  - LFO waveform selection
  - CC modulation support
- **Edge Cases**:
  - Pitch LFO during note transitions
  - Interaction with pitch envelope
  - Extreme vibrato depths

### Filter LFO
- **Feature**: LFO modulation of filter cutoff
- **SFZ Spec**: `fillfo_freq`, `fillfo_depth`, `fillfo_delay`
- **Web Audio API**: OscillatorNode modulating filter frequency
- **sfizz Reference**: `filterLFO` in Region.h
- **Requirements**:
  - Filter cutoff modulation
  - LFO rate and depth control
  - Multiple LFO waveforms
  - CC parameter modulation
- **Edge Cases**:
  - Filter frequency limits with LFO
  - LFO interaction with filter envelope
  - Resonance effects with LFO

### Multiple LFOs (SFZv2)
- **Feature**: Multiple independent LFOs per voice
- **SFZ Spec**: `lfoN_freq`, `lfoN_depth`, `lfoN_wave`, `lfoN_phase`
- **Web Audio API**: Multiple OscillatorNode instances
- **sfizz Reference**: `lfos` vector in Region.h
- **Requirements**:
  - Up to 8 independent LFOs
  - Different waveforms per LFO
  - Phase offset control
  - LFO synchronization options
- **Edge Cases**:
  - LFO interaction complexity
  - Performance with many LFOs
  - LFO parameter automation

## Filters and Equalization

### Low-Pass Filter
- **Feature**: 2-pole and 4-pole low-pass filtering
- **SFZ Spec**: `cutoff`, `resonance`, `cutoff2`, `resonance2`
- **Web Audio API**: BiquadFilterNode with custom filter chaining
- **sfizz Reference**: `FilterDescription.h`, filter implementation
- **Requirements**:
  - 12dB/oct and 24dB/oct slopes
  - Resonance control
  - Filter keytrack and velocity tracking
  - EG and LFO modulation
- **Edge Cases**:
  - Filter frequency limits
  - Resonance stability
  - Filter chaining complexity

### High-Pass Filter
- **Feature**: High-pass filtering for brightness control
- **SFZ Spec**: `cutoff`, `resonance` with high-pass mode
- **Web Audio API**: BiquadFilterNode in highpass mode
- **sfizz Reference**: Filter implementation with mode selection
- **Requirements**:
  - Configurable cutoff frequency
  - Resonance control
  - Modulation support
  - Filter slope options
- **Edge Cases**:
  - Very low cutoff frequencies
  - Filter interaction with other processing

### Band-Pass and Notch Filters
- **Feature**: Band-pass and notch filtering
- **SFZ Spec**: Filter mode selection
- **Web Audio API**: BiquadFilterNode with bandpass/notch modes
- **sfizz Reference**: Filter mode implementation
- **Requirements**:
  - Band-pass filtering for formant effects
  - Notch filtering for resonance removal
  - Q factor control
  - Modulation support
- **Edge Cases**:
  - Narrow bandwidth stability
  - Filter phase response
  - Multiple filter interactions

### Parametric Equalization
- **Feature**: Multi-band parametric EQ
- **SFZ Spec**: `eqN_freq`, `eqN_gain`, `eqN_q`, `eqN_type`
- **Web Audio API**: Multiple BiquadFilterNode instances
- **sfizz Reference**: `EQDescription.h`, EQ implementation
- **Requirements**:
  - Multiple EQ bands per voice
  - Shelving, peaking, and notch filter types
  - Frequency, gain, and Q control
  - EQ automation support
- **Edge Cases**:
  - EQ band interaction
  - Extreme EQ settings
  - EQ processing order

## Modulation System

### MIDI Controller Modulation
- **Feature**: CC modulation of all parameters
- **SFZ Spec**: `ccN`, `on_loccN`, `on_hiccN`, `curveccN`
- **Web Audio API**: Custom modulation matrix with automation
- **sfizz Reference**: `CCMap.h`, modulation implementation
- **Requirements**:
  - All 128 MIDI CCs supported
  - Unipolar and bipolar modulation
  - Curve shaping for CC response
  - Multiple CC sources per parameter
- **Edge Cases**:
  - CC value interpolation
  - CC curve edge cases
  - Multiple CC interactions

### Velocity Modulation
- **Feature**: Velocity-based parameter control
- **SFZ Spec**: `amp_veltrack`, `pitch_veltrack`, `cutoff_veltrack`
- **Web Audio API**: Velocity-based automation curves
- **sfizz Reference**: Velocity tracking in Region.h
- **Requirements**:
  - Linear and exponential velocity curves
  - Velocity curve customization
  - Velocity to multiple parameter mapping
  - Velocity curve interpolation
- **Edge Cases**:
  - Velocity curve discontinuities
  - Extreme velocity tracking values
  - Velocity curve automation

### Aftertouch Modulation
- **Feature**: Channel and polyphonic aftertouch support
- **SFZ Spec**: `lochanaft`, `hichanaft`, `lopolyaft`, `hipolyaft`
- **Web Audio API**: Aftertouch event handling with automation
- **sfizz Reference**: Aftertouch implementation in MidiState.cpp
- **Requirements**:
  - Channel aftertouch (breath control)
  - Polyphonic aftertouch per note
  - Aftertouch range specification
  - Aftertouch to parameter mapping
- **Edge Cases**:
  - Aftertouch during note transitions
  - Aftertouch curve customization
  - Aftertouch interaction with other modulations

### Pitch Bend Modulation
- **Feature**: Full pitch bend implementation
- **SFZ Spec**: `bend_up`, `bend_down`, `bend_step`
- **Web Audio API**: Pitch bend event handling with playbackRate
- **sfizz Reference**: Pitch bend implementation in Voice.cpp
- **Requirements**:
  - Configurable bend range
  - Smooth pitch transitions
  - Bend step control
  - Bend smoothing options
- **Edge Cases**:
  - Extreme bend ranges
  - Bend during note transitions
  - Bend interaction with other pitch sources

## Advanced Sample Features

### Velocity Layers
- **Feature**: Multiple samples per key range based on velocity
- **SFZ Spec**: `lovel`, `hivel`, `amp_velcurve_N`
- **Web Audio API**: Multiple AudioBufferSourceNode instances
- **sfizz Reference**: Velocity range checking in Region.cpp
- **Requirements**:
  - Overlapping velocity ranges
  - Velocity curve customization
  - Smooth layer transitions
  - Velocity crossfading
- **Edge Cases**:
  - Velocity range gaps
  - Velocity curve interpolation
  - Layer switching artifacts

### Round Robin
- **Feature**: Sequential sample selection for realism
- **SFZ Spec**: `seq_length`, `seq_position`, `lorand`, `hirand`
- **Web Audio API**: Sample selection logic with state tracking
- **sfizz Reference**: Round robin implementation in Region.cpp
- **Requirements**:
  - Sequential sample cycling
  - Random sample selection
  - Sequence position tracking
  - Group-based round robin
- **Edge Cases**:
  - Round robin state persistence
  - Multiple round robin groups
  - Round robin during rapid playing

### Crossfading
- **Feature**: Smooth transitions between samples and parameters
- **SFZ Spec**: `xfin_lokey`, `xfin_hikey`, `xfout_lokey`, `xfout_hikey`
- **Web Audio API**: Crossfade implementation with GainNode automation
- **sfizz Reference**: Crossfade implementation in Region.cpp
- **Requirements**:
  - Key-based crossfading
  - Velocity-based crossfading
  - CC-based crossfading
  - Crossfade curve control
- **Edge Cases**:
  - Crossfade timing precision
  - Multiple crossfade interactions
  - Crossfade during note transitions

### Release Samples
- **Feature**: Dedicated release samples triggered on note-off
- **SFZ Spec**: `trigger=release`, `trigger=release_key`
- **Web Audio API**: Note-off event handling with sample triggering
- **sfizz Reference**: Release trigger implementation in Region.cpp
- **Requirements**:
  - Release trigger detection
  - Release sample playback
  - Release velocity control
  - Release crossfading
- **Edge Cases**:
  - Release sample timing
  - Multiple release samples
  - Release during sustain pedal

### Sample Quality and Interpolation
- **Feature**: Configurable sample quality and interpolation
- **SFZ Spec**: `sample_quality`, `interpolation`
- **Web Audio API**: Sample rate conversion and interpolation
- **sfizz Reference**: Interpolation implementation in Interpolators.cpp
- **Requirements**:
  - Linear, cubic, and sinc interpolation
  - Quality vs performance trade-offs
  - Sample rate conversion
  - Anti-aliasing filters
- **Edge Cases**:
  - Interpolation artifacts
  - Performance with high-quality settings
  - Sample rate compatibility

## MIDI Processing

### Note Processing
- **Feature**: Complete MIDI note handling
- **SFZ Spec**: All MIDI note events and parameters
- **Web Audio API**: MIDI input handling and note scheduling
- **sfizz Reference**: MIDI state management in MidiState.cpp
- **Requirements**:
  - Note on/off with velocity
  - Note aftertouch support
  - Note priority handling
  - Note stealing algorithms
- **Edge Cases**:
  - Note overlap and conflicts
  - Rapid note triggering
  - Note priority during polyphony limits

### Continuous Controllers
- **Feature**: Full MIDI CC support
- **SFZ Spec**: All 128 MIDI continuous controllers
- **Web Audio API**: MIDI CC event handling
- **sfizz Reference**: CC processing in MidiState.cpp
- **Requirements**:
  - All standard MIDI CCs
  - Custom CC mapping
  - CC value smoothing
  - CC automation support
- **Edge Cases**:
  - CC value interpolation
  - CC event timing
  - Multiple CC interactions

### Pitch Bend and Aftertouch
- **Feature**: Complete pitch bend and aftertouch support
- **SFZ Spec**: `pitch_bend`, `aftertouch`, `poly_aftertouch`
- **Web Audio API**: Pitch bend and aftertouch event handling
- **sfizz Reference**: Pitch bend and aftertouch implementation
- **Requirements**:
  - 14-bit pitch bend resolution
  - Channel aftertouch (breath control)
  - Polyphonic aftertouch per note
  - Bend and aftertouch smoothing
- **Edge Cases**:
  - Extreme bend ranges
  - Aftertouch during note transitions
  - Bend/aftertouch interaction

### Program Changes and Bank Select
- **Feature**: MIDI program and bank change handling
- **SFZ Spec**: `program`, `bank`, `bank_lo`, `bank_hi`
- **Web Audio API**: Program change event handling
- **sfizz Reference**: Program change implementation
- **Requirements**:
  - Bank select MSB/LSB
  - Program number selection
  - Bank/program range checking
  - Multiple preset support
- **Edge Cases**:
  - Invalid bank/program combinations
  - Bank/program change timing
  - Preset switching artifacts

## Effects Processing

### Reverb
- **Feature**: Convolution and algorithmic reverb
- **SFZ Spec**: `reverb`, `reverb_send`, `reverb_time`
- **Web Audio API**: ConvolverNode and custom reverb algorithms
- **sfizz Reference**: Reverb implementation in Effects.cpp
- **Requirements**:
  - Impulse response loading
  - Algorithmic reverb parameters
  - Reverb send levels
  - Multiple reverb types
- **Edge Cases**:
  - Large impulse response memory usage
  - Reverb parameter automation
  - Reverb tail handling

### Delay
- **Feature**: Multiple delay types with feedback
- **SFZ Spec**: `delay`, `delay_time`, `delay_feedback`
- **Web Audio API**: DelayNode with feedback loops
- **sfizz Reference**: Delay implementation in Effects.cpp
- **Requirements**:
  - Tap delay with multiple taps
  - Stereo delay with ping-pong
  - Delay time automation
  - Filtered delay feedback
- **Edge Cases**:
  - Delay feedback stability
  - Very long delay times
  - Delay parameter automation

### Chorus and Ensemble
- **Feature**: Chorus and ensemble effects
- **SFZ Spec**: `chorus`, `chorus_depth`, `chorus_rate`
- **Web Audio API**: Multiple delay lines with LFO modulation
- **sfizz Reference**: Chorus implementation in Effects.cpp
- **Requirements**:
  - Multiple chorus stages
  - LFO modulation of delay time
  - Stereo chorus with phase offset
  - Ensemble effect simulation
- **Edge Cases**:
  - Chorus parameter interaction
  - Ensemble realism
  - CPU usage with multiple chorus stages

### Distortion and Overdrive
- **Feature**: Non-linear distortion effects
- **SFZ Spec**: `distortion`, `overdrive`, `drive`
- **Web Audio API**: WaveShaperNode with custom curves
- **sfizz Reference**: Distortion implementation in Effects.cpp
- **Requirements**:
  - Soft and hard clipping
  - Tube simulation
  - Distortion amount control
  - Tone shaping
- **Edge Cases**:
  - Distortion artifacts
  - CPU usage with complex curves
  - Distortion parameter automation

### Effect Buses and Routing
- **Feature**: Multiple effect buses with send/return
- **SFZ Spec**: `bus`, `send`, `return`
- **Web Audio API**: Custom bus routing with GainNode mixing
- **sfizz Reference**: Bus implementation in Effects.cpp
- **Requirements**:
  - Multiple effect buses
  - Send levels per voice
  - Bus return mixing
  - Bus effect chaining
- **Edge Cases**:
  - Bus routing complexity
  - CPU usage with many buses
  - Bus parameter automation

## Performance Features

### Polyphony Management
- **Feature**: Intelligent polyphony limits and voice allocation
- **SFZ Spec**: `polyphony`, `note_polyphony`, `group_polyphony`
- **Web Audio API**: Voice lifecycle management
- **sfizz Reference**: Polyphony management in VoiceManager.cpp
- **Requirements**:
  - Global polyphony limits
  - Per-group polyphony limits
  - Note-specific polyphony
  - Voice priority algorithms
- **Edge Cases**:
  - Polyphony limit conflicts
  - Voice stealing priority
  - Polyphony during rapid playing

### Memory Management
- **Feature**: Efficient sample and voice memory usage
- **SFZ Spec**: Sample caching and memory optimization
- **Web Audio API**: AudioBuffer memory management
- **sfizz Reference**: Memory management in FilePool.cpp
- **Requirements**:
  - Sample caching strategies
  - Memory usage monitoring
  - Sample unloading for memory conservation
  - Efficient voice allocation
- **Edge Cases**:
  - Memory pressure handling
  - Sample loading during playback
  - Memory cleanup on context suspension

### Performance Optimization
- **Feature**: Real-time performance optimization
- **SFZ Spec**: Performance-related opcodes and settings
- **Web Audio API**: Efficient audio processing
- **sfizz Reference**: Performance optimization throughout codebase
- **Requirements**:
  - CPU usage monitoring
  - Processing optimization
  - Real-time performance guarantees
  - Background processing support
- **Edge Cases**:
  - Performance under load
  - CPU usage spikes
  - Real-time thread safety

### Audio Context Management
- **Feature**: Proper Web Audio API context handling
- **SFZ Spec**: Audio context lifecycle management
- **Web Audio API**: AudioContext creation and management
- **sfizz Reference**: Audio context management patterns
- **Requirements**:
  - Context creation and suspension
  - Audio thread safety
  - Context state management
  - Performance monitoring
- **Edge Cases**:
  - Context suspension/resumption
  - Audio thread synchronization
  - Context error handling

## SFZ Specification Compliance

### SFZ Version 1 Support
- **Feature**: Complete SFZv1 specification compliance
- **SFZ Spec**: All SFZv1 opcodes and features
- **Web Audio API**: SFZv1 feature implementation
- **sfizz Reference**: SFZv1 implementation throughout codebase
- **Requirements**:
  - All SFZv1 opcodes supported
  - Backward compatibility
  - SFZv1 file parsing
  - SFZv1 behavior compliance
- **Edge Cases**:
  - SFZv1 edge case behaviors
  - Compatibility with existing SFZ files
  - SFZv1 to SFZv2 migration

### SFZ Version 2 Support
- **Feature**: SFZv2 extensions and improvements
- **SFZ Spec**: SFZv2 opcodes and features
- **Web Audio API**: SFZv2 feature implementation
- **sfizz Reference**: SFZv2 implementation in parser/
- **Requirements**:
  - Flex envelopes
  - Multiple LFOs
  - Advanced modulation
  - SFZv2 file parsing
- **Edge Cases**:
  - SFZv2 compatibility
  - Advanced feature interactions
  - SFZv2 performance optimization

### ARIA Extensions
- **Feature**: ARIA-specific opcode support
- **SFZ Spec**: ARIA opcodes and extensions
- **Web Audio API**: ARIA feature implementation
- **sfizz Reference**: ARIA implementation in parser/
- **Requirements**:
  - ARIA-specific opcodes
  - ARIA behavior compliance
  - ARIA file compatibility
  - ARIA performance optimization
- **Edge Cases**:
  - ARIA-specific behaviors
  - ARIA compatibility issues
  - ARIA performance characteristics

### Error Handling and Validation
- **Feature**: Robust error handling and file validation
- **SFZ Spec**: Error handling requirements
- **Web Audio API**: Error handling patterns
- **sfizz Reference**: Error handling throughout codebase
- **Requirements**:
  - Malformed file handling
  - Invalid opcode handling
  - Missing sample handling
  - Graceful degradation
- **Edge Cases**:
  - Partial file loading
  - Error recovery strategies
  - User-friendly error messages

## Implementation Notes

### Web Audio API Limitations
- **Buffer Size**: Fixed buffer sizes may affect timing precision
- **Latency**: Browser audio latency considerations
- **Performance**: CPU usage optimization for real-time processing
- **Browser Support**: Cross-browser compatibility requirements

### sfizz Implementation Patterns
- **Voice Architecture**: Follow sfizz's voice management patterns
- **Modulation Matrix**: Implement sfizz's modulation system
- **Sample Loading**: Use sfizz's efficient sample loading strategies
- **Error Handling**: Follow sfizz's robust error handling approach

### Performance Considerations
- **Voice Count**: Limit concurrent voices for performance
- **Sample Size**: Optimize sample loading and memory usage
- **Processing**: Minimize CPU usage in audio thread
- **Memory**: Efficient memory management for large sample sets

This comprehensive feature list provides the foundation for implementing a fully-featured SFZ web audio player with complete specification compliance and professional-grade performance.