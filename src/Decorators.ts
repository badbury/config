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

export const EnvVar = (env?: string) => decorate((d) => d.envVar(env));
export const Default = (value: any) => decorate((d) => d.default(value));
export const EnvDefault = (env: string, value: any) => decorate((d) => d.envDefault(env, value));
export const Flag = (longFlag?: string, shortFlag?: string) =>
  decorate((d) => d.flag(longFlag, shortFlag));
export const Transform = (mapper: (a: any) => any) => decorate((d) => d.map(mapper));
export const Validate = (predicates: Predicates<any>) => decorate((d) => d.validate(predicates));
export const Nested = (object: ConfigDefinitions<any>) => decorate((d) => d.object(object));

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
