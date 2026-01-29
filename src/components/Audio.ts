import { AudioControlEvent, AudioKeyboardMap } from '../types/audio';
import { AudioOptions, AudioPreload } from '../types/player';
import Event from './event';
import { FileLocal, FileRemote } from '../types/files';
import FileLoader from '../utils/fileLoader';
import { VoiceManager } from './VoiceManager';
import { midiNameToNum, pathGetDirectory } from '@sfz-tools/core/dist/utils';
import { parseHeaders, parseSfz } from '@sfz-tools/core/dist/parse';
import { ParseHeader, ParseOpcodeObj } from '@sfz-tools/core/dist/types/parse';

class Audio extends Event {
  loader: FileLoader;
  private preload: AudioPreload = AudioPreload.ON_DEMAND;
  private regions: ParseOpcodeObj[] = [];
  private context: AudioContext;
  private voiceManager: VoiceManager;
  private bend: number = 0;
  private chanaft: number = 64;
  private polyaft: number = 64;
  private bpm: number = 120;
  private sustainPedal: boolean = false;
  private sostenutoPedal: boolean = false;
  private activeNotes: Set<number> = new Set();
  private roundRobinCounters: Map<string, number> = new Map(); // Track round-robin per note
  private regionDefaults: any = {
    lochan: 0,
    hichan: 15,
    lokey: 0,
    hikey: 127,
    lovel: 0,
    hivel: 127,
    lobend: -8192,
    hibend: 8192,
    lochanaft: 0,
    hichanaft: 127,
    lopolyaft: 0,
    hipolyaft: 127,
    lorand: 0,
    hirand: 1,
    lobpm: 0,
    hibpm: 500,
  };

  constructor(options: AudioOptions) {
    super();
    if (!window.AudioContext) window.alert('Browser does not support WebAudio');
    this.context = new window.AudioContext();
    console.log('🎵 Audio Context created, state:', this.context.state);
    
    // Add event listeners to track context state changes
    this.context.onstatechange = () => {
      console.log('🎵 Audio Context state changed to:', this.context.state);
    };
    
    // Add click event listener to resume audio context on user interaction
    document.addEventListener('click', () => {
      if (this.context.state === 'suspended') {
        this.context.resume().then(() => {
          console.log('🎵 Audio Context resumed after user interaction');
        }).catch((error) => {
          console.error('🎵 Failed to resume audio context:', error);
        });
      }
    }, { once: true }); // Only listen for the first click
    
    this.voiceManager = new VoiceManager(this.context, 64);
    
    // Start audio processing loop
    this.startAudioLoop();
    
    if (window.webAudioControlsWidgetManager) {
      window.webAudioControlsWidgetManager.addMidiListener((event: any) => this.onKeyboard(event));
    } else {
      console.log('webaudio-controls not found, add to a <script> tag.');
    }
    if (options.loader) {
      this.loader = options.loader;
    } else {
      this.loader = new FileLoader();
    }
    // Use shared loader
    // parseSetLoader(this.loader);
    if (options.root) this.loader.setRoot(options.root);
    if (options.file) {
      const file: FileLocal | FileRemote | undefined = this.loader.addFile(options.file);
      this.showFile(file);
    }
    if (options.preload) this.preload = options.preload;
  }

  async showFile(file: FileLocal | FileRemote | undefined) {
    this.dispatchEvent('preload', {
      status: `Loading sfz files`,
    });
    this.dispatchEvent('loading', true);
    file = await this.loader.getFile(file);
    if (!file) return;
    console.log('showFile', file);
    const prefix: string = pathGetDirectory(file.path);
    console.log('prefix', prefix);

    let headers: ParseHeader[] = [];
    if (file.ext === 'sfz') {
      headers = await parseSfz(file?.contents, prefix);
      console.log('headers', headers);
    } else if (file.ext === 'json') {
      headers = JSON.parse(file?.contents).elements;
    }

    this.regions = parseHeaders(headers, prefix);
    this.regions = this.midiNamesToNum(this.regions);
    console.log('regions', this.regions);
    
    // Debug: Check if regions have proper key mappings
    console.log('🔍 Debug: First few regions after parsing:', this.regions.slice(0, 5).map(r => ({
      key: r.key,
      lokey: r.lokey,
      hikey: r.hikey,
      lovel: r.lovel,
      hivel: r.hivel,
      sample: r.sample
    })));

    console.log('preload', this.preload);
    if (this.preload === AudioPreload.SEQUENTIAL) {
      await this.preloadFiles(this.regions);
    } else {
      this.dispatchEvent('keyboardMap', this.getKeyboardMap(this.regions));
    }
    this.dispatchEvent('loading', false);
  }

  getKeyboardMap(regions: ParseOpcodeObj[]) {
    const keyboardMap: AudioKeyboardMap = {};
    regions.forEach((region: ParseOpcodeObj) => {
      this.updateKeyboardMap(region, keyboardMap);
    });
    return keyboardMap;
  }

  midiNameToNumConvert(val: string | number) {
    if (typeof val === 'number') return val;
    const isLetters: RegExp = /[a-zA-Z]/g;
    if (isLetters.test(val)) return midiNameToNum(val);
    return parseInt(val, 10);
  }

  midiNamesToNum(regions: ParseOpcodeObj[]) {
    for (const key in regions) {
      const region: ParseOpcodeObj = regions[key];
      if (region.lokey) region.lokey = this.midiNameToNumConvert(region.lokey);
      if (region.hikey) region.hikey = this.midiNameToNumConvert(region.hikey);
      if (region.key) region.key = this.midiNameToNumConvert(region.key);
      if (region.pitch_keycenter) region.pitch_keycenter = this.midiNameToNumConvert(region.pitch_keycenter);
    }
    return regions;
  }

  updateKeyboardMap(region: ParseOpcodeObj, keyboardMap: AudioKeyboardMap) {
    if (!region.lokey && region.key) region.lokey = region.key;
    if (!region.hikey && region.key) region.hikey = region.key;
    const merged = Object.assign({}, this.regionDefaults, region);
    for (let i = merged.lokey; i <= merged.hikey; i += 1) {
      keyboardMap[i] = true;
    }
  }

  async preloadFiles(regions: ParseOpcodeObj[]) {
    const keyboardMap: AudioKeyboardMap = {};
    this.dispatchEvent('keyboardMap', keyboardMap);
    let start: number = 0;
    const end: number = Object.keys(regions).length - 1;
    for (const key in regions) {
      this.dispatchEvent('preload', {
        status: `Loading audio files: ${start} of ${end}`,
      });
      const samplePath: string = regions[key].sample;
      if (!samplePath || samplePath.includes('*')) continue;
      await this.loader.getFile(samplePath, true);
      start += 1;
      this.updateKeyboardMap(regions[key], keyboardMap);
      this.dispatchEvent('keyboardMap', keyboardMap);
    }
  }

  checkRegion(region: ParseOpcodeObj, controlEvent: AudioControlEvent, rand: number) {
    return (
      region.sample != null &&
      region.lochan <= controlEvent.channel &&
      region.hichan >= controlEvent.channel &&
      region.lokey <= controlEvent.note &&
      region.hikey >= controlEvent.note &&
      region.lovel <= controlEvent.velocity &&
      region.hivel >= controlEvent.velocity &&
      region.lobend <= this.bend &&
      region.hibend >= this.bend &&
      region.lochanaft <= this.chanaft &&
      region.hichanaft >= this.chanaft &&
      region.lopolyaft <= this.polyaft &&
      region.hipolyaft >= this.polyaft &&
      region.lorand <= rand &&
      region.hirand >= rand &&
      region.lobpm <= this.bpm &&
      region.hibpm >= this.bpm
    );
  }

  checkRegions(regions: ParseOpcodeObj[], controlEvent: AudioControlEvent) {
    const random = Math.random();
    return regions.filter((region: ParseOpcodeObj) => {
      // Handle group inheritance - if region doesn't have key but has group key
      if (!region.lokey && region.key) region.lokey = region.key;
      if (!region.hikey && region.key) region.hikey = region.key;
      
      // Apply region defaults
      const merged = Object.assign({}, this.regionDefaults, region);
      
      // Debug logging for silent instruments
      if (merged.key === controlEvent.note && merged.sample) {
        console.log(`🔍 Region match check for note ${controlEvent.note}:`, {
          key: merged.key,
          lokey: merged.lokey,
          hikey: merged.hikey,
          lovel: merged.lovel,
          hivel: merged.hivel,
          velocity: controlEvent.velocity,
          sample: merged.sample
        });
      }
      
      return this.checkRegion(merged, controlEvent, random);
    });
  }

  onKeyboard(event: any) {
    console.log('🎹 Raw event:', event);
    
    // Handle both MIDI input and virtual keyboard events
    let controlEvent: AudioControlEvent;
    
    if (event.data) {
      // MIDI input event
      const [status, note, velocity] = event.data;
      const messageType = status & 0xF0;
      const channel = (status & 0x0F) + 1;
      
      if (messageType === 0x90 || messageType === 0x80) {
        // Note On/Off
        const isNoteOn = messageType === 0x90 && velocity > 0;
        const isNoteOff = messageType === 0x80 || (messageType === 0x90 && velocity === 0);
        
        console.log(`🎵 MIDI Note: status=0x${status.toString(16)}, note=${note}, vel=${velocity}, isOn=${isNoteOn}, isOff=${isNoteOff}`);
        
        controlEvent = {
          channel: channel,
          note: note,
          velocity: isNoteOff ? 0 : velocity, // Keep as MIDI velocity 0-127
        };
        
        // Debug: Log velocity values
        console.log(`🎵 Velocity debug: raw=${velocity}, kept=${controlEvent.velocity}, range=0-127`);
      } else if (messageType === 0xB0) {
        // Control Change
        this.handleControlChange(channel, note, velocity);
        return; // Don't process as note event
      } else {
        console.log(`🎵 MIDI Other: status=0x${status.toString(16)}`);
        return; // Don't process other MIDI messages
      }
    } else {
      // Virtual keyboard event (already processed in Interface)
      console.log('🎹 Virtual keyboard event:', event);
      controlEvent = event;
    }
    
    console.log('🎶 Final controlEvent:', controlEvent);
    this.update(controlEvent);
    this.dispatchEvent('change', controlEvent);
  }

  private handleControlChange(channel: number, controller: number, value: number) {
    console.log(`🎛️ MIDI CC: ch=${channel}, cc=${controller}, val=${value}`);
    
    // Sustain pedal (CC64)
    if (controller === 64) {
      const wasSustainPressed = this.sustainPedal;
      this.sustainPedal = value >= 64; // Threshold of 64 as per MIDI spec
      
      console.log(`🎹 Sustain pedal: ${wasSustainPressed ? 'released' : 'pressed'} -> ${this.sustainPedal ? 'pressed' : 'released'}`);
      
      // Handle sustain pedal release - release all sustaining notes
      if (wasSustainPressed && !this.sustainPedal) {
        this.voiceManager.releaseSustainedNotes();
      }
    }
    
    // Sostenuto pedal (CC66)
    if (controller === 66) {
      this.sostenutoPedal = value >= 64;
      console.log(`🎹 Sostenuto pedal: ${this.sostenutoPedal ? 'pressed' : 'released'}`);
    }
    
    // Pitch bend (CC0-31/32-63 for MSB/LSB, but usually handled separately)
    if (controller === 0 || controller === 32) {
      // Pitch bend is usually handled as a separate event type, but we'll track it here
      this.bend = value; // This is simplified - real pitch bend is 14-bit
      console.log(`🎵 Pitch bend: ${this.bend}`);
    }
  }

  private startAudioLoop() {
    console.log('🎵 Starting audio processing loop');
    const processAudio = () => {
      console.log('🎵 Audio loop: processing block');
      this.voiceManager.renderBlock(128); // Process 128 samples per block
      requestAnimationFrame(processAudio);
    };
    processAudio();
  }

  async update(event: AudioControlEvent) {
    console.log(`🎵 Update: note=${event.note}, vel=${event.velocity}, activeNotes=${Array.from(this.activeNotes)}`);
    
    if (event.velocity === 0) {
      console.log(`🔴 Note OFF: ${event.note}`);
      this.voiceManager.noteOff(event.note);
      // Don't immediately remove from activeNotes - keep it until the voice is actually released
      // This allows async voice creation to work properly
      return;
    }

    // Check if we already have active voices for this note
    if (this.activeNotes.has(event.note)) {
      console.log(`⚠️ Note ${event.note} already active, ignoring retrigger`);
      return;
    }

    console.log(`🔵 Note ON: ${event.note}, velocity=${event.velocity}`);
    this.activeNotes.add(event.note);
    
    const regionsFiltered = this.checkRegions(this.regions, event);
    console.log(`🎯 Found ${regionsFiltered.length} matching regions:`, regionsFiltered.map(r => r.sample));
    
    if (!regionsFiltered.length) {
      this.activeNotes.delete(event.note);
      return;
    }

    if (regionsFiltered.length === 1) {
      const region = regionsFiltered[0];
      await this.triggerVoiceForRegion(region, event);
    } else if (regionsFiltered.length > 1) {
      const noteKey = `${event.note}`;
      const currentIndex = this.roundRobinCounters.get(noteKey) || 0;
      const region = regionsFiltered[currentIndex % regionsFiltered.length];
      
      console.log(`🎯 Round-robin: selecting ${currentIndex % regionsFiltered.length + 1}/${regionsFiltered.length} for note ${event.note}`);
      
      this.roundRobinCounters.set(noteKey, currentIndex + 1);
      await this.triggerVoiceForRegion(region, event);
    }
  }

  private async triggerVoiceForRegion(region: ParseOpcodeObj, event: AudioControlEvent) {
    const fileRef: FileLocal | FileRemote | undefined = this.loader.files[region.sample];
    const newFile: FileLocal | FileRemote | undefined = await this.loader.getFile(fileRef || region.sample, true);
    
    if (newFile?.contents) {
      console.log(`🎵 Triggering voice for sample: ${region.sample}`);
      
      // Check if the note was already released before the voice was created
      // This can happen with async voice triggering where note-off is processed before voice creation
      if (this.activeNotes.has(event.note)) {
        // Note is still active, trigger normally
        this.voiceManager.triggerVoice(region, newFile.contents, event);
      } else {
        // Note was already released, don't create a voice at all
        console.log(`🎵 Note ${event.note} was already released, not creating voice`);
        return;
      }
    } else {
      console.warn(`⚠️ Failed to load sample: ${region.sample}`);
      this.activeNotes.delete(event.note);
    }
  }

  reset() {
    this.voiceManager.stopAll();
    this.activeNotes.clear();
  }

  /**
   * Handle CC events from interface
   */
  handleCC(ccNumber: number, ccValue: number) {
    console.log(`🎛️ Interface CC: cc=${ccNumber}, val=${ccValue}`);
    
    // Handle sustain pedal (CC64)
    if (ccNumber === 64) {
      const wasSustainPressed = this.sustainPedal;
      this.sustainPedal = ccValue >= 64; // Threshold of 64 as per MIDI spec
      
      console.log(`🎹 Sustain pedal: ${wasSustainPressed ? 'released' : 'pressed'} -> ${this.sustainPedal ? 'pressed' : 'released'}`);
      
      // Call VoiceManager's registerCC method to handle sustain pedal release
      this.voiceManager.registerCC(0, ccNumber, ccValue);
    }
  }
}

export default Audio;
