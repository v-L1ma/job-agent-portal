export type ResponseBase<T> = {
  message: string;
  data: T;
};