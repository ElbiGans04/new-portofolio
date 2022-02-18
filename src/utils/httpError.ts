export default class HttpError extends Error {
  public status: number;
  public detail: string;

  constructor(m: string, status: number, detail: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);

    // Set other property
    this.status = status;
    this.detail = detail;
  }
}
