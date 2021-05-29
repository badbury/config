import { ConfigDefinition } from './ConfigDefinition';
import { ConfigContext } from './ConfigContext';
import { ConfigErrors } from './Errors/ConfigErrors';
import { Description } from './ConfigResolver';

export type ConfigDefinitions<T> = {
  [key in keyof T]: ConfigDefinition<T[key]>;
};

export type DefinitionsResolved<T> = {
  [key in keyof T]: DefinitionResolved<T[key]>;
};

type DefinitionResolved<T> = T extends ConfigDefinition<infer X> ? X : never;

export class Config<T extends Partial<Record<string, any>>> {
  constructor(private definitions: ConfigDefinitions<T>, prefix = '') {
    for (const key in this.definitions) {
      this.definitions[key].name = `${prefix}${key}`;
    }
  }

  describe(): Description {
    const meta = {} as Record<keyof T, Record<string, string> & { name: string }>;
    for (const key in this.definitions) {
      for (const metaItem of this.definitions[key].describe()) {
        meta[metaItem.name as keyof T] = meta[metaItem.name]
          ? { ...meta[metaItem.name], ...metaItem }
          : metaItem;
      }
    }
    return Object.values(meta);
  }

  resolve(context: ConfigContext = new ConfigContext()): T {
    const result: T = {} as T;
    const errors = [];
    for (const key in this.definitions) {
      try {
        result[key] = this.definitions[key].resolve(context);
      } catch (error) {
        if (error instanceof ConfigErrors) {
          errors.push(...error.errors);
        } else {
          errors.push(error);
        }
      }
    }
    if (errors.length > 0) {
      throw new ConfigErrors(errors);
    }
    return result;
  }

  environmentVariables(): string[] {
    return this.describe()
      .filter((description) => !!description.envVar)
      .map((description) => description.envVar);
  }
}
