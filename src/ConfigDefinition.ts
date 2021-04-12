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

export class ConfigDefinition<C = never> {
    protected resolvers: Resolver[] = [];

    constructor(public name: string = '') {}

    use<T>(resolver: Resolver<T>): ConfigDefinition<C|T> {
        this.resolvers.push(resolver);
        return this;
    }

    envVar(key?: string): ConfigDefinition<C|string> {
        return this.use(new EnvironmentVariableResolver(key));
    }

    flag(longFlag?: string, shortFlag?: string) {
        return this.use(new CommandLineFlagResolver(longFlag, shortFlag));
    }

    forEnv<T>(envrionment: string, value: T): ConfigDefinition<C|T> {
        return this.use(new EnvironmentDefaultResolver(envrionment, value));
    }

    custom<T>(key: string) {
        return this.use(new CustomValueResolver<T>(key));
    }

    map<T>(mapper: (a: C) => T): ConfigDefinition<T> {
        return this.use(new TransformResolver<T>(mapper)) as ConfigDefinition<T>;
    }

    default<T>(value: T): ConfigDefinition<C|T> {
        return this.use(new DefaultResolver(value));
    }

    optional(): ConfigDefinition<C|null> {
        return this.use(new DefaultResolver(null));
    }

    // object(): ConfigDefinition<C|null> {
    //     return this.use(new ObjectDefinition(() => ({
    //         foo: define().default(989),
    //         bar: define().default('989'),
    //         baz: define().envVar('FLOOPERS'),
    //     })));
    // }

    validate(predicates: Predicates<C>): ConfigDefinition<C>  {
        return this.use(new ValidateResolver(predicates));
    }

    resolve(config: ConfigSources): ResolvedValue<C> {
        let subject: ResolvedValue = { name: this.name, found: false, errors: [] }
        for (const resolver of this.resolvers) {
            subject = resolver.resolve(config, subject)
        }
        return subject;
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
