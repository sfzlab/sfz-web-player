import { xml2js } from "xml-js";

async function get(url: string): Promise<string> {
  console.log("⤓", url);
  return fetch(url).then((res: any) => res.text());
}

async function getJSON(url: string): Promise<any> {
  console.log("⤓", url);
  return fetch(url).then((res: any) => res.json());
}

async function getRaw(url: string): Promise<Buffer> {
  console.log("⤓", url);
  return fetch(url).then((res: any) => res.buffer());
}

async function getXML(url: string): Promise<object> {
  console.log("⤓", url);
  return fetch(url).then(async (res: any) => xml2js(await res.text()));
}

export { get, getJSON, getRaw, getXML };
