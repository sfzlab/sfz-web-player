import { FilesMap, FilesNested } from "../types/files";
import Component from "./component";
import "./fileList.scss";
declare class FileList extends Component {
    constructor();
    render(branch: string, directory: string, files: FilesMap, filesNested: FilesNested): void;
    createTree(root: string, branch: string, directory: string, files: FilesMap, filesNested: FilesNested): HTMLUListElement;
}
export default FileList;
