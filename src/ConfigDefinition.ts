import { Resolver, ResolvedValue } from "./Resolver";
import { EnvironmentVariableResolver } from "./Resolvers/EnvironmentVariableResolver";
import { DefaultResolver } from "./Resolvers/DefaultResolver";
import { CustomValueResolver } from "./Resolvers/CustomValueResolver";
import { EnvironmentDefaultResolver } from "./Resolvers/EnvironmentDefaultResolver";
import { TransformResolver } from "./Resolvers/TransformResolver";
import { ConfigValidatonError } from "./Errors/ConfigValidationError";
import { CouldNotResolveConfigValue } from "./Errors/CouldNotResolveConfigValue";
import { ConfigSources } from "./ConfigSources";
import { CommandLineFlagResolver } from "./Resolvers/CommandLineFlagResolver";
import { Predicates, ValidateResolver } from "./Resolvers/ValidateResolver";
import { ResolverChain } from "./Resolvers/ResolverChain";
import { NoopResolver } from "./Resolvers/NoopResolver";
import { ObjectResolver } from "./Resolvers/ObjectResolver";
import { ConfigDefinitions } from "./Config";

export class ConfigDefinition<C = never> {
    constructor(
        public name: string = '',
        protected resolver: Resolver<never, C> = new NoopResolver<never>(),
    ) {}

    use<O>(resolver: Resolver<C, O>): ConfigDefinition<O> {
        return new ConfigDefinition(
            this.name,
            new ResolverChain(this.resolver, resolver)
        );
    }

    envVar(key?: string): ConfigDefinition<C|string> {
        return this.use(new EnvironmentVariableResolver(key));
    }

    flag(longFlag?: string, shortFlag?: string): ConfigDefinition<C|string> {
        return this.use(new CommandLineFlagResolver(longFlag, shortFlag));
    }

    forEnv<T>(envrionment: string, value: T): ConfigDefinition<C|T> {
        return this.use(new EnvironmentDefaultResolver(envrionment, value));
    }

    custom<T>(key: string): ConfigDefinition<C|T> {
        return this.use(new CustomValueResolver(key));
    }

    map<T>(mapper: (a: C) => T): ConfigDefinition<T> {
        return this.use(new TransformResolver(mapper));
    }

    default<T>(value: T): ConfigDefinition<C|T> {
        return this.use(new DefaultResolver(value));
    }

    optional(): ConfigDefinition<C|null> {
        return this.use(new DefaultResolver(null));
    }

    object<T>(object: ConfigDefinitions<T>): ConfigDefinition<T> {
        return this.use(new ObjectResolver(object));
    }

    validate(predicates: Predicates<C>): ConfigDefinition<C>  {
        return this.use(new ValidateResolver(predicates));
    }

    resolve(config: ConfigSources): ResolvedValue<C> {
        return this.resolver.resolve(config, { name: this.name, found: false, errors: [] });
    }

    resolveAndExtract(config: ConfigSources): C {
        const subject = this.resolve(config);
        if (subject.found === false) {
            throw new CouldNotResolveConfigValue(this.name)
        }
        if (subject.errors.length > 0) {
            throw new ConfigValidatonError(this.name, subject.value, subject.errors);
        }
        return subject.value;
    }
}
