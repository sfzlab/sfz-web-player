import InstrumentList from "./components/InstrumentList";
import "./index.scss";

class Index {
  el: DocumentFragment = document.createDocumentFragment();

  render(): DocumentFragment {
    this.el.appendChild(new InstrumentList().render());
    return this.el;
  }
}

document.body.appendChild(new Index().render());

export default Index;
