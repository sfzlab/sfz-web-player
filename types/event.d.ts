interface EventData {
    data: any;
    target: any;
    type: string;
}
type EventFunc = (data: EventData) => void;
interface EventList {
    [type: string]: EventFunc[];
}
export { EventData, EventFunc, EventList };
