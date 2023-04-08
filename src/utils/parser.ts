import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "./fileLoader";

let loader: FileLoader;

const skipCharacters: string[] = [" ", "\t", "\r", "\n"];
const endCharacters: string[] = ["\r", "\n"];

async function loadSfz(path: string) {
  const file: FileLocal | FileRemote | undefined = await loader.getFile(
    loader.root + path
  );
  return await parseSfz(file?.contents);
}

async function parseSfz(contents: string) {
  let header: string = "";
  const map: any = {};
  let values: any = {};
  for (let i: number = 0; i < contents.length; i++) {
    const char: string = contents.charAt(i);
    if (skipCharacters.includes(char)) continue;
    const iEnd: number = findEnd(contents, i);
    if (char === "/") {
      // const comment: string = contents.slice(i + 2, iEnd);
      // console.log("comment", comment);
    } else if (char === "#") {
      const directive: string = contents.slice(i + 10, iEnd - 1);
      const directiveValues: any = await loadSfz(directive);
      console.log("directive", directive);
      console.log("directiveValues", directiveValues);
    } else if (char === "<") {
      header = contents.slice(i + 1, iEnd - 1);
      values = {};
      if (!map[header]) map[header] = [];
      map[header].push(values);
      console.log("header", header);
    } else {
      const opcode: string = contents.slice(i, iEnd);
      const [opcodeName, opcodeValue]: any[] = opcode.split("=");
      let opcodeValueTyped: any = opcodeValue;
      if (!isNaN(opcodeValue as any)) {
        opcodeValueTyped = Number(opcodeValue);
      }
      values[opcodeName] = opcodeValueTyped;
      console.log("opcode", opcodeName, opcodeValueTyped);
    }
    i = iEnd;
  }
  return map;
}

function findEnd(contents: string, startAt: number) {
  for (let index: number = startAt; index < contents.length; index++) {
    const char: string = contents.charAt(index);
    if (endCharacters.includes(char)) return index;
  }
  return contents.length;
}

function setLoader(fileLoader: FileLoader) {
  loader = fileLoader;
}

export { loadSfz, parseSfz, setLoader };
