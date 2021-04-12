import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class EnvironmentDefaultResolver<I, O> implements Resolver<I, I|O> {
    constructor(private environment: string, private value: O) {}
    resolve(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|O> {
        const environment = config.getEnvironment();
        if (environment.NODE_ENV === this.environment) {
            return { ...last, found: true, value: this.value }
        }
        return last;
    }
}
