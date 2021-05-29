import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, ConfigResolver } from '../ConfigResolver';

export class DefaultResolver<I, O> implements ConfigResolver<I, I | O> {
  constructor(private value: O) {}

  describe(name: string): Description {
    return [{ name, default: JSON.stringify(this.value) }];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I | O> {
    if (last.found === false) {
      return { ...last, found: true, value: this.value, source: 'default value ' };
    }
    return last;
  }
}
