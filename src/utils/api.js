import { get, post, getArrayBuffer } from "./https";

const prefix = process.env.NODE_ENV === "development" ? "/api" : "";
export async function demoPost(data) {
  return await post(`url`, data);
}

export async function demoGet(param) {
  return await get(`url`, param);
}

export async function musicList(param) {
  return await get(`${prefix}/musicList`, param);
}

export async function musicDetail(param) {
  return await get(`${prefix}/musicDetail`, param);
}

export async function custom(url, param) {
  return await getArrayBuffer(`${prefix}${url}`, param);
}
export async function customByChain(url, param) {
  return await getArrayBuffer(`${url}`, param);
}
