import Component from "./component";
import * as ace from "ace-builds";
import * as modelist from "ace-builds/src-noconflict/ext-modelist";
import "ace-builds/webpack-resolver";
var Mode = require("../lib/mode-sfz").Mode;

class CodeEditor extends Component {
  private editor: any;
  private supportedFiles: string[] = [
    "json",
    "md",
    "sfz",
    "txt",
    "yml",
    "yaml",
  ];

  constructor() {
    super("codeEditor");
    this.editor = ace.edit(this.getEl(), {
      maxLines: 50,
      minLines: 10,
      theme: "ace/theme/monokai",
    });
  }

  async loadFile(path: string) {
    const fileExt: string = path.split(".").pop() || "";
    if (this.supportedFiles.includes(fileExt)) {
      const response: any = await fetch(path);
      const fileContents: string = await response.text();
      if (fileExt === "sfz") {
        this.editor.session.setMode(new Mode());
      } else {
        const mode: string = modelist.getModeForPath(path).mode;
        this.editor.session.setMode(mode);
      }
      this.editor.setOption("value", fileContents);
    }
  }
}

export default CodeEditor;
