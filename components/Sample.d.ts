import { AudioControlEvent, AudioSfzOpcodeObj } from '../types/audio';
declare class Sample {
    private context;
    private region;
    private source;
    private sampleRate;
    private sampleDefaults;
    constructor(context: AudioContext, buffer: AudioBuffer, region: AudioSfzOpcodeObj);
    getCents(note: number, bend: number): number;
    pitchToFreq(pitch: number): number;
    setPlaybackRate(event: AudioControlEvent, bend?: number): void;
    play(): void;
    stop(): void;
}
export default Sample;
