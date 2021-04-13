import { Resolver, ResolvedValue, Description } from "./Resolver";
import { EnvironmentVariableResolver } from "./Resolvers/EnvironmentVariableResolver";
import { DefaultResolver } from "./Resolvers/DefaultResolver";
import { EnvironmentDefaultResolver } from "./Resolvers/EnvironmentDefaultResolver";
import { TransformResolver } from "./Resolvers/TransformResolver";
import { InvalidConfig } from "./Errors/InvalidConfig";
import { MissingConfig } from "./Errors/MissingConfig";
import { ConfigContext } from "./ConfigContext";
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

    envDefault<T>(envrionment: string, value: T): ConfigDefinition<C|T> {
        return this.use(new EnvironmentDefaultResolver(envrionment, value));
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

    describe(): Description {
        return this.resolver.describe(this.name);
    }

    resolve(context: ConfigContext): ResolvedValue<C> {
        return this.resolver.resolve(context, { name: this.name, found: false, errors: [], options: [] });
    }

    resolveAndExtract(context: ConfigContext): C {
        const subject = this.resolve(context);
        if (subject.found === false) {
            throw new MissingConfig(this.name, subject.options);
        }
        if (subject.errors.length > 0) {
            const value = context.hideValuesInErrors ? 'HIDDEN' : subject.value ;
            throw new InvalidConfig(this.name, value, subject.errors, subject.source);
        }
        return subject.value;
    }
}
