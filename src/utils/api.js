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
// 音乐列表
export async function onepiecemusic(param) {
  // return await get(`${prefix}/onepiecemusics`, param);
  return await get(`${prefix}/getMusicList`, param);
}
export async function musiclist(param) {
  return await get(`${prefix}/musiclist`, param);
}
export async function musiclinks(param) {
  return await get(`${prefix}/musiclinks`, param);
}
export async function visitCount(param) {
  return await post(`${prefix}/visitCount`, param);
}
export async function getVisits(param) {
  return await get(`${prefix}/getVisits`, param);
}
export async function musicDetail(param) {
  return await get(`${prefix}/musicDetail`, param);
}

export async function custom(url, param) {
  return await getArrayBuffer(`${prefix}${url}`, param);
}
export async function customByChain(url, param) {
  return await getArrayBuffer(`/oss${url}`, param);
}
