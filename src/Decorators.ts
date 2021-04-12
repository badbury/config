import { ConfigDefinition } from "./ConfigDefinition";
import { ConfigSources } from "./ConfigSources";
import { Resolver } from './Resolver';
import "reflect-metadata";
import { Predicates } from "./Resolvers/ValidateResolver";
import { Config, ConfigDefinitions } from "./Config";

class ConfigDefinitionForDecorators<C = never> extends ConfigDefinition<C> {
    use<T>(resolver: Resolver<T>): ConfigDefinition<C|T> {
        // Unshift instead of push because decorators are applied in reverse order
        this.resolvers.unshift(resolver);
        return this;
    }
}

function getDefinition(target: any, property: string): ConfigDefinition {
    let definitions: Record<string, ConfigDefinition> = Reflect.getMetadata('configDefinitions', target) || {};
    definitions[property] = definitions[property] || new ConfigDefinitionForDecorators(property);
    Reflect.defineMetadata('configDefinitions', definitions, target);
    return definitions[property];
}

export function EnvVar(env?: string) {
    return function (target: any, property: string) {
        getDefinition(target, property).envVar(env);
    };
}

export function Default(value: any) {
    return function (target: any, property: string) {
        getDefinition(target, property).default(value);
    };
}

export function EnvDefault(env: string, value: any) {
    return function (target: any, property: string) {
        getDefinition(target, property).forEnv(env, value);
    };
}

export function Flag(longFlag?: string, shortFlag?: string) {
    return function (target: any, property: string) {
        getDefinition(target, property).flag(longFlag, shortFlag);
    };
}

export function Custom(key: string) {
    return function (target: any, property: string) {
        getDefinition(target, property).custom(key);
    };
}

export function Transform(mapper: (a: any) => any) {
    return function (target: any, property: string) {
        getDefinition(target, property).map(mapper);
    };
}
export function Validate(predicates: Predicates<any>) {
    return function (target: any, property: string) {
        getDefinition(target, property).validate(predicates);
    };
}

export function fromDecoratedConfig<T>(
    decoratedConfig: new () => T,
    sources: ConfigSources = new ConfigSources(),
): T {
    const target: T = new decoratedConfig();
    const definitions: ConfigDefinitions<any> = Reflect.getMetadata('configDefinitions', target);
    const config = new Config<T>(definitions, sources);
    const resolvedConfig = config.getAll();
    for (const property in resolvedConfig) {
        target[property] = resolvedConfig[property];
    }
    return target;
}
