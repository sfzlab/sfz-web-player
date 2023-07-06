import fetch from 'node-fetch';
import { xml2js } from 'xml-js';

async function get(url: string): Promise<string> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.text());
}

async function getGithubFiles(repo: string, branch = 'main') {
  const response: any = await getJSON(`https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`);
  return response.tree.map((file: any) => `https://raw.githubusercontent.com/${repo}/${branch}/${file.path}`);
}

async function getJSON(url: string): Promise<any> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.json());
}

async function getRaw(url: string): Promise<ArrayBuffer> {
  console.log('⤓', url);
  return fetch(url).then((res: any) => res.arrayBuffer());
}

async function getXML(url: string): Promise<object> {
  console.log('⤓', url);
  return fetch(url).then(async (res: any) => xml2js(await res.text()));
}

export { get, getGithubFiles, getJSON, getRaw, getXML };
