import { FileLocal, FileRemote } from "../types/files";
import FileLoader from "./fileLoader";

let loader: FileLoader;
let header: string;

async function processToken(token: string, map: any, values: any) {
  console.log("processToken", token);
  if (token.startsWith("<")) {
    header = token.slice(1, -1);
    values = {};
    if (!map[header]) map[header] = [];
    map[header].push(values);
  }
  if (token.startsWith("#")) {
    const file: FileLocal | FileRemote | undefined = await loader.getFile(
      loader.root + token.slice(10, -1)
    );
    const include: any = await parseSfz(file?.contents);
    console.log(loader.root + token.slice(10, -1), header, include);
    map[header].push(include);
  }
  if (token.includes("=")) {
    const [id, val] = token.split("=");
    if (!isNaN(val as any)) {
      values[id] = Number(val);
    } else {
      values[id] = val;
    }
  }
}

function getLines(str: string) {
  return str
    .replace(
      /(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\')\/\/.*))/gm,
      ""
    )
    .split(/\r?\n/);
}

async function parseSfz(contents: string) {
  const map: any = {};
  const values: any = {};
  const lines: string[] = getLines(contents);
  for (let line of lines) {
    line = line.trim();
    if (line.length === 0 || line.startsWith("//")) continue;
    if (line.includes(" ") && !line.startsWith("#")) {
      const sublines: string[] = line.split(/ /);
      sublines.forEach(
        async (subline) => await processToken(subline, map, values)
      );
    } else {
      await processToken(line, map, values);
    }
  }
  return map;
}

function setLoader(fileLoader: FileLoader) {
  loader = fileLoader;
}

export { parseSfz, setLoader };
