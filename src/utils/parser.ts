import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "./fileLoader";

let loader: FileLoader;

const DEBUG: boolean = false;
const skipCharacters: string[] = [" ", "\t", "\r", "\n"];
const endCharacters: string[] = [">", "\r", "\n"];

async function parseSfz(prefix: string, contents: string) {
  let header: string = "";
  const map: any = {};
  let values: any = {};
  for (let i: number = 0; i < contents.length; i++) {
    const char: string = contents.charAt(i);
    if (skipCharacters.includes(char)) continue;
    const iEnd: number = findEnd(contents, i);
    if (char === "/") {
      // do nothing
    } else if (char === "#") {
      const directive: string = contents.slice(i + 10, iEnd - 1);
      const fileRef: FileLocal | FileRemote | undefined =
        loader.files[prefix + directive];
      const file: FileLocal | FileRemote | undefined = await loader.getFile(
        fileRef || prefix + directive
      );
      const directiveValues: any = await parseSfz(prefix, file?.contents);
      const headerValues: any[] = map[header];
      headerValues[headerValues.length - 1] = {
        ...headerValues[headerValues.length - 1],
        ...directiveValues,
      };
      if (DEBUG)
        console.log(
          "headerValues",
          headerValues.length - 1,
          headerValues[headerValues.length - 1]
        );
    } else if (char === "<") {
      header = contents.slice(i + 1, iEnd);
      values = {};
      if (!map[header]) map[header] = [];
      map[header].push(values);
      if (DEBUG) console.log("header", header);
    } else {
      const opcode: string = contents.slice(i, iEnd);
      const opcodeGroups: string[] = opcode.split(/[= ]/g);
      let opcodeName: string = "";
      for (let j = 0; j < opcodeGroups.length; j++) {
        if (j % 2 === 0) {
          opcodeName = opcodeGroups[j];
        } else {
          if (!isNaN(opcodeGroups[j] as any)) {
            values[opcodeName] = Number(opcodeGroups[j]);
          } else {
            values[opcodeName] = opcodeGroups[j];
          }
        }
      }
      if (DEBUG) console.log("opcode", opcode, opcodeGroups);
    }
    i = iEnd;
  }
  if (!header) return values;
  return map;
}

function findEnd(contents: string, startAt: number) {
  for (let index: number = startAt; index < contents.length; index++) {
    const char: string = contents.charAt(index);
    if (endCharacters.includes(char)) return index;
    if (char === "/" && contents.charAt(index + 1) === "/") return index;
  }
  return contents.length;
}

function setParserLoader(fileLoader: FileLoader) {
  loader = fileLoader;
}

export { parseSfz, setParserLoader };
