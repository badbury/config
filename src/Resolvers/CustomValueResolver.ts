import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class CustomValueResolver<T> implements Resolver<T> {
    constructor(private key: string) {}
    resolve<I>(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|T> {
        const values = config.getCustomValues();
        if (Object.keys(values).includes(this.key)) {
            return { ...last, found: true, value: values[this.key] }
        }
        return last;
    }
}
