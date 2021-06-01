import { bind, Definition, ResolverSink, on, RegisterDefinitions } from '@badbury/ioc';
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

  register(context: ConfigContext, sink: ResolverSink): void {
    const schema = this.getSchemaObject();
    sink.register(bind(this.subject).factory(() => schema.resolve(context)));
  }

  schema(schemaObject: SchemaInput<T>): ConfigIocDefinition {
    if (this.isSchemaClass(schemaObject)) {
      return new ConfigIocDefinition(this.subject, new Config(new schemaObject()));
    }
    if (this.isSchemaObject(schemaObject)) {
      return new ConfigIocDefinition(this.subject, new Config(schemaObject));
    }
    return new ConfigIocDefinition(this.subject, schemaObject);
  }

  private getSchemaObject(): Config<T> {
    if (this.schemaObject) {
      return this.schemaObject;
    }
    const subject = new this.subject();
    const field = define().envVar();
    const definitions = Object.keys(subject).reduce((def: ConfigDefinitions<T>, key: string) => {
      const hasDefault = typeof subject[key as keyof T] !== 'undefined';
      const definition = hasDefault ? field.default(subject[key as keyof T]) : field.withName(key);
      return { [key as keyof T]: definition, ...def };
    }, {} as ConfigDefinitions<T>);
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
