import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, Resolver } from '../Resolver';

export class TransformResolver<I, O> implements Resolver<I, O> {
  constructor(private mapper: (value: I) => O) {}

  describe(): Description {
    return [];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<O> {
    if (last.found !== false) {
      return { ...last, value: this.mapper(last.value) };
    }
    return last;
  }
}
