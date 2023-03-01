import Component from "./component";
import "./instrumentList.scss";
import { PluginInterface } from "../types/instruments";
declare class InstrumentList extends Component {
    private plugins;
    constructor();
    render(): void;
    pluginLatest(pluginId: string): PluginInterface;
}
export default InstrumentList;