import Component from "./component";
import "./instrumentList.scss";
import { PluginInterface } from "../types/instruments";
declare global {
    interface Window {
        test: any;
    }
}
declare class InstrumentList extends Component {
    private plugins;
    constructor();
    render(): void;
    addFileSelect(): void;
    pluginLatest(pluginId: string): PluginInterface;
}
export default InstrumentList;
