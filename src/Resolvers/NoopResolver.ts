import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class NoopResolver<T> implements Resolver<T, T> {
    resolve(config: ConfigSources, last: ResolvedValue<T>): ResolvedValue<T> {
        return last;
    }
}
