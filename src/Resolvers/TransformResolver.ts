import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class TransformResolver<T> implements Resolver<T> {
    constructor(private mapper: (value: any) => T) {}
    resolve<I>(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<T> {
        if (last.found !== false) {
            return { ...last, value: this.mapper(last.value) };
        }
        return last;
    }
}
