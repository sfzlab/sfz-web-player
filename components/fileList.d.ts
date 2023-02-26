import Component from "./component";
import "./fileList.scss";
declare class FileList extends Component {
    private files;
    constructor();
    render(): void;
    onClick(e: MouseEvent): void;
}
export default FileList;
