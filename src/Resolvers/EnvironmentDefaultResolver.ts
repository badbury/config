import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class EnvironmentDefaultResolver<T> implements Resolver<T> {
    constructor(private environment: string, private value: T) {}
    resolve<I>(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|T> {
        const environment = config.getEnvironment();
        if (environment.NODE_ENV === this.environment) {
            return { ...last, found: true, value: this.value }
        }
        return last;
    }
}
