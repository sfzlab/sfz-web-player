import Event from "./event";
declare class Component extends Event {
    private el;
    getEl(): DocumentFragment;
}
export default Component;
