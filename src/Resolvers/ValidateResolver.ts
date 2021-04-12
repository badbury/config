import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export type Predicates<E> = Record<string, (a: E) => boolean>;

export class ValidateResolver<E> implements Resolver<never, E> {

    constructor(private predicates: Predicates<E>) {}

    resolve(config: ConfigSources, last: ResolvedValue<E>): ResolvedValue<E> {
        if (!last.found) {
            return last;
        }
        const errors = this.validate(last.value);
        if (errors.length === 0) {
            return last;
        }
        return { ...last, errors: [ ...last.errors, ...errors ] }
    }

    validate(value: E): string[] {
        return Object.keys(this.predicates).filter((check) => !this.predicates[check](value))
    }
}
