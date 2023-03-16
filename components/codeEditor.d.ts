import "./codeEditor.scss";
import Component from "./component";
import "ace-builds/webpack-resolver";
import { FileItem } from "../types/files";
declare class CodeEditor extends Component {
    private editor;
    private supportedFiles;
    constructor();
    render(file: FileItem): void;
}
export default CodeEditor;
