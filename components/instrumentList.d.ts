import Component from "./component";
import "./instrumentList.scss";
import { PluginInterface } from "../types/instruments";
declare class InstrumentList extends Component {
    private plugins;
    constructor();
    pluginLatest(pluginId: string): PluginInterface;
    render(): void;
}
export default InstrumentList;
