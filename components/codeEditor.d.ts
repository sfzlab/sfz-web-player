import "./codeEditor.scss";
import Component from "./component";
import "ace-builds/webpack-resolver";
declare class CodeEditor extends Component {
    private editor;
    private supportedFiles;
    constructor();
    loadFile(path: string): Promise<void>;
}
export default CodeEditor;
