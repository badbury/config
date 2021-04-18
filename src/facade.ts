import { ConfigDefinition } from './ConfigDefinition';

export function define(name = ''): ConfigDefinition {
  return new ConfigDefinition(name);
}
