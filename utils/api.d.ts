declare function get(url: string): Promise<string>;
declare function getJSON(url: string): Promise<any>;
declare function getRaw(url: string): Promise<ArrayBuffer>;
declare function getXML(url: string): Promise<object>;
export { get, getJSON, getRaw, getXML };
