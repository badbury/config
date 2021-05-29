import {
  bind,
  Definition,
  ResolverSink,
  on,
  RegisterDefinitions,
  FactoryResolver,
} from '@badbury/ioc';
import { Config, ConfigDefinitions } from './Config';
import { ConfigContext } from './ConfigContext';
import { define } from './facade';

type SchemaInput<T> = Config<T> | (new () => ConfigDefinitions<T>) | ConfigDefinitions<T>;

export class ConfigIocDefinition<T = unknown> implements Definition<ConfigIocDefinition> {
  definition = ConfigIocDefinition;
  constructor(
    public readonly subject: new () => T,
    public readonly schemaObject: Config<T> | undefined = undefined,
  ) {}

  schema(schemaObject: SchemaInput<T>): ConfigIocDefinition {
    if (this.isSchemaClass(schemaObject)) {
      return new ConfigIocDefinition(this.subject, new Config(new schemaObject()));
    }
    if (this.isSchemaObject(schemaObject)) {
      return new ConfigIocDefinition(this.subject, new Config(schemaObject));
    }
    return new ConfigIocDefinition(this.subject, schemaObject);
  }

  register(context: ConfigContext, sink: ResolverSink): void {
    const schema = this.getSchemaObject();
    sink.register(new FactoryResolver(this.subject, [], () => schema.resolve(context)));
  }

  private getSchemaObject(): Config<T> {
    if (this.schemaObject) {
      return this.schemaObject;
    }
    const subject = new this.subject();
    const definitions = {} as ConfigDefinitions<T>;
    const field = define().envVar();
    for (const key of Object.keys(subject)) {
      let definition = field.withName(key);
      if (typeof subject[key as keyof T] !== 'undefined') {
        definition = definition.default(subject[key as keyof T]) as any;
      }
      definitions[key as keyof T] = definition as any;
    }
    return new Config(definitions);
  }

  private isSchemaClass(input: SchemaInput<T>): input is new () => ConfigDefinitions<T> {
    return !!(input as { prototype: unknown })?.prototype;
  }

  private isSchemaObject(input: SchemaInput<T>): input is ConfigDefinitions<T> {
    return !(input instanceof Config);
  }
}

export class ConfigModule {
  register(): Definition[] {
    return [
      bind(ConfigContext),
      on(RegisterDefinitions)
        .use(ConfigContext, ResolverSink)
        .do((event, context, sink) => {
          for (const definition of event.definitions) {
            if (definition instanceof ConfigIocDefinition) {
              definition.register(context, sink);
            }
          }
        }),
    ];
  }
}

export function config<T>(subject: new () => T): ConfigIocDefinition<T> {
  return new ConfigIocDefinition(subject);
}
