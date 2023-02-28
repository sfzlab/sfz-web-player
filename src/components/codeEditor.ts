import Component from "./component";
import * as ace from "ace-builds";
import * as modelist from "ace-builds/src-noconflict/ext-modelist";
import "ace-builds/webpack-resolver";

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
    });
  }

  async loadFile(path: string) {
    const fileExt: string = path.split(".").pop() || "";
    if (this.supportedFiles.includes(fileExt)) {
      const response: any = await fetch(path);
      const fileContents: string = await response.text();
      const mode: string = modelist.getModeForPath(path).mode;
      this.editor.session.setMode(mode);
      this.editor.setOption("value", fileContents);
    }
  }
}

export default CodeEditor;
