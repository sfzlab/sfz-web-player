import Event from "./event";

class Component extends Event {
  private el: DocumentFragment = document.createDocumentFragment();

  getEl() {
    return this.el;
  }
}

export default Component;
