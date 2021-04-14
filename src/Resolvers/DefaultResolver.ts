import { ConfigContext } from '../ConfigContext';
import { ResolvedValue, Resolver } from '../Resolver';

export class DefaultResolver<I, O> implements Resolver<I, I | O> {
  constructor(private value: O) {}

  describe(name: string) {
    return [{ name, default: JSON.stringify(this.value) }];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I | O> {
    if (last.found === false) {
      return { ...last, found: true, value: this.value, source: 'default value ' };
    }
    return last;
  }
}
