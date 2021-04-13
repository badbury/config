import { ConfigContext } from "../ConfigContext";
import { ResolvedValue, Resolver } from "../Resolver";

export class NoopResolver<T> implements Resolver<T, T> {
    resolve(context: ConfigContext, last: ResolvedValue<T>): ResolvedValue<T> {
        return last;
    }
}
