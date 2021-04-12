import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class DefaultResolver<T> implements Resolver {
    constructor(private value: T) {}
    resolve<I>(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|T> {
        if (last.found === false) {
            return { ...last, found: true, value: this.value };
        }
        return last;
    }
}
