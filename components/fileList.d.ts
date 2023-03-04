import { EventData } from "../types/event";
import { FilesNested } from "../types/files";
import Component from "./component";
import "./fileList.scss";
declare class FileList extends Component {
    private branch;
    private files;
    private filesNested;
    private instrument;
    constructor();
    render(): void;
    createTree(path: string, filesNested: FilesNested): HTMLUListElement;
    fileLoad(eventData: EventData): Promise<void>;
}
export default FileList;
