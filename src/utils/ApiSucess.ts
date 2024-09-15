// @desc Structures data from success with more relevant data

export interface ResponsePayload<T> {
  data?: T[] | T;
  pages?: number;
  page?: number;
  limit?: number;
  total?: number;
}

export class ApiSuccess<T> {
  success: boolean;
  message?: string;
  payload?: ResponsePayload<T>;

  constructor({ payload, message }: { payload?: ResponsePayload<T>; message?: string }) {
    this.success = true;
    this.payload = payload;

    if (message) {
      this.message = message;
    }
  }
}
