export interface Error {
  message: string;
  code: number;
}

export interface StreamRes<T> {
  [key: string]: T;
}
