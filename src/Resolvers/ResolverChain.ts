import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, ConfigResolver } from '../ConfigResolver';

export class ResolverChain<I, M, O, A extends ConfigResolver<I, M>, B extends ConfigResolver<M, O>>
  implements ConfigResolver<I, O> {
  constructor(private first: A, private second: B) {}

  describe(name: string): Description {
    return [...this.first.describe(name), ...this.second.describe(name)];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<O> {
    const next = this.first.resolve(context, last);
    return this.second.resolve(context, next);
  }
}
