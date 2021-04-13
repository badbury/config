import { ConfigContext } from "../ConfigContext";
import { ResolvedValue, Resolver } from "../Resolver";

export class EnvironmentDefaultResolver<I, O> implements Resolver<I, I|O> {

    constructor(private environment: string, private value: O) {}

    describe(name: string) {
        return [{ envDefault: '' }];
    }

    resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I|O> {
        if (context.environment.NODE_ENV === this.environment) {
            return { ...last, found: true, value: this.value, source: `${this.environment} environment default ` }
        }
        return last;
    }
}
