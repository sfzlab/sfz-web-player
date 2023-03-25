import "./Editor.scss";
import "ace-builds/webpack-resolver";
import Component from "./component";
import { FileLocal, FileRemote, FilesMap, FilesTree } from "../types/files";
import { EditorOptions } from "../types/player";
import FileLoader from "../utils/fileLoader";
declare class Editor extends Component {
    private ace;
    private aceEl;
    private fileEl;
    loader: FileLoader;
    constructor(options: EditorOptions);
    showFile(file: FileLocal | FileRemote | undefined): Promise<void>;
    createTree(root: string, files: FilesMap, filesTree: FilesTree): HTMLUListElement;
    render(): void;
}
export default Editor;
