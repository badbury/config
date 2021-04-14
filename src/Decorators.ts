import { ConfigDefinition } from './ConfigDefinition';
import { ConfigContext } from './ConfigContext';
import { Resolver } from './Resolver';
import { Predicates } from './Resolvers/ValidateResolver';
import { Config, ConfigDefinitions } from './Config';
import { ResolverChain } from './Resolvers/ResolverChain';
import 'reflect-metadata';

class ConfigDefinitionForDecorators<C = never> extends ConfigDefinition<C> {
  use(resolver: Resolver<any, any>): ConfigDefinition<any> {
    return new ConfigDefinitionForDecorators(
      this.name,
      new ResolverChain(resolver, this.resolver as any),
    );
  }
}

function decorate(update: (definition: ConfigDefinition<any>) => ConfigDefinition<any>): any {
  return function (target: any, property: string) {
    const definitions: Record<string, ConfigDefinition<any>> =
      Reflect.getMetadata('configDefinitions', target) || {};
    definitions[property] = definitions[property] || new ConfigDefinitionForDecorators(property);
    definitions[property] = update(definitions[property]);
    Reflect.defineMetadata('configDefinitions', definitions, target);
  };
}

export function EnvVar(env?: string): void {
  decorate((d) => d.envVar(env));
}
export function Default(value: any): void {
  decorate((d) => d.default(value));
}
export function EnvDefault(env: string, value: any): void {
  decorate((d) => d.envDefault(env, value));
}
export function Flag(longFlag?: string, shortFlag?: string): void {
  decorate((d) => d.flag(longFlag, shortFlag));
}
export function Transform(mapper: (a: any) => any): void {
  decorate((d) => d.map(mapper));
}
export function Validate(predicates: Predicates<any>): void {
  decorate((d) => d.validate(predicates));
}
export function Nested(object: ConfigDefinitions<any>): void {
  decorate((d) => d.object(object));
}

export function fromDecoratedConfig<T>(
  decoratedConfig: new () => T,
  context: ConfigContext = new ConfigContext(),
): T {
  const target: T = new decoratedConfig();
  const definitions: ConfigDefinitions<any> = Reflect.getMetadata('configDefinitions', target);
  const config = new Config<T>(definitions, context);
  const resolvedConfig = config.getAll();
  for (const property in resolvedConfig) {
    target[property] = resolvedConfig[property];
  }
  return target;
}
