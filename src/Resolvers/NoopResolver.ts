import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, Resolver } from '../Resolver';

export class NoopResolver<T> implements Resolver<T, T> {
  describe(): Description {
    return [];
  }

  resolve(context: ConfigContext, last: ResolvedValue<T>): ResolvedValue<T> {
    return last;
  }
}
