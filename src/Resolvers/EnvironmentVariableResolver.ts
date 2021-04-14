import { ConfigContext } from '../ConfigContext';
import { ResolvedValue, Resolver } from '../Resolver';

export class EnvironmentVariableResolver<I> implements Resolver<I, I | string> {
  constructor(private key?: string) {}

  describe(name: string) {
    const key = this.key ? this.key : this.format(name);
    return [{ name, envVar: key }];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I | string> {
    const environment = context.environment;
    const key = this.key ? this.key : this.format(last.name);
    const value = environment[key];
    last.options.push(`env var ${key}`);
    if (value) {
      return { ...last, found: true, value, source: `env var ${key}=` };
    }
    return last;
  }

  private format(name: string): string {
    return name
      .replace(/[A-Z]/g, (letter) => `_${letter}`)
      .replace(/\./g, '_')
      .toUpperCase();
  }
}
