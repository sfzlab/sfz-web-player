declare function encodeHashes(item: string): string;
declare function midiNameToNum(name: string | number): any;
declare function pathDir(item: string, separator?: string): string;
declare function pathExt(item: string): string;
declare function pathJoin(...segments: any): string;
declare function pathRoot(item: string, separator?: string): string;
declare function pathSubDir(item: string, dir: string): string;
export { encodeHashes, midiNameToNum, pathDir, pathExt, pathJoin, pathRoot, pathSubDir };
