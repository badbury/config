import { inspect } from 'util';

export class InvalidConfig<T> extends Error {
  public name = 'InvalidConfig';
  public message = 'Invalid config';
  public configKey: string;
  public configValue: T;
  public reasons: string[];

  constructor(configKey: string, configValue: T, reasons: string[], source: string) {
    super();
    const reason = reasons.join(' and ');
    const value = JSON.stringify(configValue);
    this.message = `${this.message} for ${configKey}. Using ${source}${value} but ${reason}`;
    this.configKey = configKey;
    this.configValue = configValue;
    this.reasons = reasons;
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
