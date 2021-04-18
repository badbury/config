import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, Resolver } from '../Resolver';

export class TypeResolver<I, O> implements Resolver<I, I | O> {
  constructor(private type: any) {}

  describe(name: string): Description {
    return [{ name, type: this.type.name }];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I | O> {
    if (!last.found) {
      return last;
    }
    if ((last.value as any).constructor == this.type) {
      return last;
    }
    return { ...last, errors: [...last.errors, `must be type ${this.type.name}`] };
  }
}
