import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class TransformResolver<I, O> implements Resolver<I, O> {
    constructor(private mapper: (value: I) => O) {}
    resolve(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<O> {
        if (last.found !== false) {
            return { ...last, value: this.mapper(last.value) };
        }
        return last;
    }
}
