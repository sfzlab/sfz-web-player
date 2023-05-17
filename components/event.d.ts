import { EventFunc, EventList } from '../types/event';
declare class Event {
    events: EventList;
    addEvent(type: string, func: EventFunc): void;
    removeEvent(type: string, func: EventFunc): void;
    dispatchEvent(type: string, data: any): void;
}
export default Event;
