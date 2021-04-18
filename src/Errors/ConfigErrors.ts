import { inspect } from 'util';

export class ConfigErrors extends Error {
  public name = 'ConfigErrors';
  public message = 'Invalid or missing config values';
  public errors: Error[];

  constructor(errors: Error[]) {
    super();
    this.errors = errors;
  }

  [inspect.custom](): string {
    return this.stringSummary();
  }

  toJSON(): { type: string; error: string; reasons: string[] } {
    return this.objectSummary();
  }

  objectSummary(): { type: string; error: string; reasons: string[] } {
    return {
      type: this.name,
      error: `${this.message}`,
      reasons: this.errors.map((error) => error.message),
    };
  }

  stringSummary(): string {
    const errorMessages = this.errors.map((error) => ' - ' + error.message).join('\n');
    return `${this.name}: ${this.message} \n${errorMessages}`;
  }
}
