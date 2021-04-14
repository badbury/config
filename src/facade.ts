import { Config, ConfigDefinitions } from './Config';
import { ConfigDefinition } from './ConfigDefinition';

let configInstance: Config<any>;

export function init<T = any>(definitions: ConfigDefinitions<T>): Config<T> {
  return (configInstance = new Config(definitions));
}

export function getGlobalConfig<T = any>(): Config<T> {
  if (!configInstance) {
    throw new Error('Config not defined');
  }
  return configInstance;
}

export function define(name = '') {
  return new ConfigDefinition(name);
}

export function get<T>(key: string): T {
  return getGlobalConfig().get(key);
}

export function getAll<T>(): T {
  return getGlobalConfig().getAll();
}
