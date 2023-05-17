import Event from './event';
declare class Component extends Event {
    private el;
    constructor(className: string);
    getEl(): HTMLDivElement;
}
export default Component;
