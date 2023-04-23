type PlayerElement = PlayerButton | PlayerImage | PlayerKnob | PlayerSlider | PlayerText;
declare enum PlayerElements {
    Keyboard = "keyboard",
    Knob = "knob",
    Slider = "slider",
    Switch = "switch"
}
interface PlayerButton {
    h: string;
    image: string;
    param: string;
    w: string;
    x: string;
    y: string;
}
interface PlayerImage {
    h: string;
    image: string;
    transparent?: string;
    w: string;
    x: string;
    y: string;
}
interface PlayerKnob {
    frames: string;
    h: string;
    image: string;
    param: string;
    w: string;
    x: string;
    y: string;
}
interface PlayerSlider {
    h: string;
    image_bg: string;
    image_handle: string;
    orientation: string;
    param: string;
    w: string;
    x: string;
    y: string;
}
interface PlayerText {
    color_text: string;
    h: string;
    text: string;
    transparent: string;
    w: string;
    x: string;
    y: string;
}
export { PlayerButton, PlayerElement, PlayerElements, PlayerImage, PlayerKnob, PlayerSlider, PlayerText, };
