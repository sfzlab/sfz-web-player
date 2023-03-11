import "./codeEditor.scss";
import Component from "./component";
import * as ace from "ace-builds";
import * as modelist from "ace-builds/src-noconflict/ext-modelist";
import "ace-builds/webpack-resolver";
import { FileItem } from "../types/files";
const Mode = require("../lib/mode-sfz").Mode;

class CodeEditor extends Component {
  private editor: any;
  private supportedFiles: string[] = [
    "json",
    "json",
    "md",
    "sfz",
    "txt",
    "xml",
    "yml",
    "yaml",
  ];

  constructor() {
    super("codeEditor");
    this.editor = ace.edit(this.getEl(), {
      theme: "ace/theme/monokai",
    });
  }

  render(file: FileItem) {
    if (!this.supportedFiles.includes(file.ext)) return;
    if (file.ext === "sfz") {
      this.editor.session.setMode(new Mode());
    } else {
      const mode: string = modelist.getModeForPath(file.path).mode;
      this.editor.session.setMode(mode);
    }
    this.editor.setOption("value", file.contents);
  }
}

export default CodeEditor;
