import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, ConfigResolver } from '../ConfigResolver';

export class NoopResolver<T> implements ConfigResolver<T, T> {
  describe(): Description {
    return [];
  }

  resolve(context: ConfigContext, last: ResolvedValue<T>): ResolvedValue<T> {
    return last;
  }
}
