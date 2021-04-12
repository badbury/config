import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class DefaultResolver<I, O> implements Resolver<I, I|O> {
    constructor(private value: O) {}
    resolve(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|O> {
        if (last.found === false) {
            return { ...last, found: true, value: this.value };
        }
        return last;
    }
}
