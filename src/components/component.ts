import Event from "./event";

class Component extends Event {
  el: DocumentFragment = document.createDocumentFragment();
}

export default Component;
