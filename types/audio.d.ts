declare global {
    interface Window {
        WebAudioControlsOptions: any;
        webAudioControlsWidgetManager: any;
    }
}
interface AudioControlEvent {
    channel: number;
    note: number;
    velocity: number;
}
interface AudioKeys {
    [key: number]: AudioSample[];
}
interface AudioSample {
    ampeg_release?: number;
    hikey: number;
    lokey: number;
    key: number;
    pitch_keycenter: number;
    region: AudioSfzRegion[];
    sample: string;
    seq_position: number;
    seq_length: number;
    tune: number;
    volume: number;
}
interface AudioSfz {
    control: AudioControl[];
    global: AudioSfzGlobal[];
    variables: AudioSfzVariables;
}
interface AudioControl {
    default_path: string;
}
interface AudioSfzGlobal {
    ampeg_release?: number;
    group: AudioSfzGroup[];
}
interface AudioSfzGroup {
    hikey: number;
    lokey: number;
    key: number;
    pitch_keycenter: number;
    region: AudioSfzRegion[];
    seq_length: number;
    tune: number;
    volume: number;
}
interface AudioSfzRegion {
    sample: string;
    seq_position: number;
}
interface AudioSfzVariables {
    [name: string]: string;
}
export { AudioControl, AudioControlEvent, AudioKeys, AudioSample, AudioSfz, AudioSfzGlobal, AudioSfzGroup, AudioSfzRegion, AudioSfzVariables, };
