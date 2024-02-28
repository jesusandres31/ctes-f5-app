/**
 * api
 */
// export interface Error {
//   message: string;
//   code: number;
// }

// export interface StreamRes<T> {
//   [key: string]: T;
// }

/**
 * base interfaces
 */
export interface BaseItem<Expand> {
  id: string;
  created: Date;
  updated: Date;
  expand: Expand;
}

export interface UpdateItemReq<T> {
  id: string;
  data: T;
}
