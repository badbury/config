import { Config, ConfigDefinitions } from "../Config"
import { ConfigSources } from "../ConfigSources"
import { ResolvedValue, Resolver } from "../Resolver"

export class ObjectResolver<I, O> implements Resolver<I, O> {
    constructor(private object: ConfigDefinitions<O>) {}

    resolve(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<O> {
        // @TODO proper error handling, recommend an alternative class to Config
        const value = new Config(this.object, config, `${last.name}.`).getAll();
        return { ...last, found: true, value };
    }
}
