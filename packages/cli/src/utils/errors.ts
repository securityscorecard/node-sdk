export class CLIError extends Error {
  public message: string;

  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message);
    this.message = message;
    this.errors = errors;
  }

  toJSON() {
    return {
      message: this.message,
      errors: this.errors?.map(e => e.message),
    };
  }
}

export default { CLIError };
