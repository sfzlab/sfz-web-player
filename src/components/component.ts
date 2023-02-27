import Event from "./event";

class Component extends Event {
  private el: HTMLDivElement = document.createElement("div");

  constructor(className: string) {
    super();
    this.getEl().className = className;
  }

  getEl() {
    return this.el;
  }
}

export default Component;
