type EventFunc = (data: any) => void;
declare class Event {
    events: {
        [type: string]: EventFunc[];
    };
    addEvent(type: string, func: EventFunc): void;
    removeEvent(type: string, func: EventFunc): void;
    dispatchEvent(type: string, data: any): void;
}
export default Event;
