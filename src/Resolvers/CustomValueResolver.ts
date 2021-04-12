import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class CustomValueResolver<I, O> implements Resolver<I, I|O> {
    constructor(private key: string) {}
    resolve(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|O> {
        const values = config.getCustomValues();
        if (Object.keys(values).includes(this.key)) {
            return { ...last, found: true, value: values[this.key] }
        }
        return last;
    }
}
