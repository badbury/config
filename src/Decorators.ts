import { ConfigDefinition } from './ConfigDefinition';
import { ConfigContext } from './ConfigContext';
import { ConfigResolver } from './ConfigResolver';
import { Predicates } from './Resolvers/ValidateResolver';
import { Config, ConfigDefinitions } from './Config';
import { ResolverChain } from './Resolvers/ResolverChain';
import { TypeResolver } from './Resolvers/TypeResolver';
import 'reflect-metadata';

const typeKey = 'design:type';
const configKey = 'badbury:config';

class ConfigDefinitionForDecorators<C = never> extends ConfigDefinition<C> {
  use(resolver: ConfigResolver<any, any>): ConfigDefinition<any> {
    return new ConfigDefinitionForDecorators(
      this.name,
      new ResolverChain(resolver, this.resolver as any),
    );
  }
}

function decorate(update: (definition: ConfigDefinition<any>) => ConfigDefinition<any>): Decorator {
  return function (target: any, property: string) {
    const definitions: ConfigDefinitions<any> = Reflect.getMetadata(configKey, target) || {};
    if (!definitions[property]) {
      const type: any = Reflect.getMetadata(typeKey, target, property);
      definitions[property] = new ConfigDefinitionForDecorators(property, new TypeResolver(type));
    }
    definitions[property] = update(definitions[property]);
    Reflect.defineMetadata(configKey, definitions, target);
  };
}

type Decorator = (target: any, propertyKey: string) => void;

export function EnvVar(env?: string): Decorator {
  return decorate((d) => d.envVar(env));
}
export function Default(value: any): Decorator {
  return decorate((d) => d.default(value));
}
export function EnvDefault(env: string, value: any): Decorator {
  return decorate((d) => d.envDefault(env, value));
}
export function Flag(longFlag?: string, shortFlag?: string): Decorator {
  return decorate((d) => d.flag(longFlag, shortFlag));
}
export function Transform(mapper: (a: any) => any): Decorator {
  return decorate((d) => d.map(mapper));
}
export function Validate(predicates: Predicates<any>): Decorator {
  return decorate((d) => d.validate(predicates));
}
export function Nested(): Decorator {
  return function (target: any, property: string) {
    const type = Reflect.getMetadata(typeKey, target, property as string);
    const nestedTarget = new type();
    const definitions: ConfigDefinitions<any> = Reflect.getMetadata(configKey, nestedTarget);
    decorate((d) => d.object(definitions, type))(target, property);
  };
}

export function fromDecoratedConfig<T>(
  decoratedConfig: new () => T,
  context: ConfigContext = new ConfigContext(),
): T {
  const target: T = new decoratedConfig();
  const definitions: ConfigDefinitions<T> = Reflect.getMetadata(configKey, target);
  const config = new Config<T>(definitions, context);
  const resolvedConfig = config.resolve();
  for (const property in resolvedConfig) {
    target[property] = resolvedConfig[property];
  }
  return target;
}
