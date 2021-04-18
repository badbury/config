import { inspect } from 'util';

export class MissingConfig extends Error {
  public name = 'MissingConfig';
  public message = 'Missing config';
  public configKey: string;

  constructor(configKey: string, options: string[]) {
    super();
    this.message = `${this.message} for ${configKey}. Configure using ${options.join(' or ')}`;
    this.configKey = configKey;
  }

  [inspect.custom](): string {
    return this.stringSummary();
  }

  toJSON(): { type: string; error: string } {
    return this.objectSummary();
  }

  objectSummary(): { type: string; error: string } {
    return {
      type: this.name,
      error: `${this.message}`,
    };
  }

  stringSummary(): string {
    return `${this.name}: ${this.message}`;
  }
}
