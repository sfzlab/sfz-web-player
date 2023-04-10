import FileLoader from "./fileLoader";
declare function parseSfz(contents: string): Promise<any>;
declare function setParserLoader(fileLoader: FileLoader): void;
export { parseSfz, setParserLoader };
