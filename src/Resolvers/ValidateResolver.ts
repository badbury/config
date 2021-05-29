import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, ConfigResolver } from '../ConfigResolver';

export type Predicates<E> = Record<string, (a: E) => boolean>;

export class ValidateResolver<I> implements ConfigResolver<I, I> {
  constructor(private predicates: Predicates<I>) {}

  describe(name: string): Description {
    const rules = Object.keys(this.predicates) as string[];
    let validate = rules.pop();
    if (rules.length > 0) {
      validate = `${rules.join(', ')} and ${validate}`;
    }
    return validate ? [{ name, validate }] : [];
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I> {
    if (!last.found) {
      return last;
    }
    const errors = this.validate(last.value);
    if (errors.length === 0) {
      return last;
    }
    return { ...last, errors: [...last.errors, ...errors] };
  }

  validate(value: I): string[] {
    return Object.keys(this.predicates).filter((check) => !this.predicates[check](value));
  }
}
