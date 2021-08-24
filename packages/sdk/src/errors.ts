export class SSCApiError extends Error {
  public errors: any[];

  constructor(message: string, errors: any[]) {
    super(message);
    this.errors = errors;
  }

  toJSON() {
    return {
      message: this.message,
      errors: this.errors?.map(e => e.message),
    };
  }
}

export default { SSCApiError };
