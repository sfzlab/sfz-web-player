type EventFunc = (data: any) => void;

class Event {
  events: { [type: string]: EventFunc[] } = {};

  addEvent(type: string, func: EventFunc) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(func);
  }

  removeEvent(type: string, func: EventFunc) {
    if (this.events[type]) {
      if (func) {
        this.events[type].forEach((eventFunc: EventFunc, index: number) => {
          if (eventFunc === func) {
            this.events[type].splice(index, 1);
            return true;
          }
        });
      } else {
        delete this.events[type];
      }
    }
  }

  dispatchEvent(type: string, data: any) {
    if (this.events[type]) {
      this.events[type].forEach((eventFunc: EventFunc) => {
        eventFunc({ data, target: this, type });
      });
    }
  }
}

export default Event;
