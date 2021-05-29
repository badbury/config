import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, ConfigResolver } from '../ConfigResolver';

export class EnvironmentDefaultResolver<I, O> implements ConfigResolver<I, I | O> {
  constructor(private environment: string, private value: O) {}

  describe(name: string): Description {
    return [{ name, envDefault: `${this.environment}=${this.value}` }];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I | O> {
    if (context.environment.NODE_ENV === this.environment) {
      return {
        ...last,
        found: true,
        value: this.value,
        source: `${this.environment} environment default `,
      };
    }
    return last;
  }
}
