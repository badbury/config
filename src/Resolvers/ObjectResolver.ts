import { Config, ConfigDefinitions } from '../Config';
import { ConfigContext } from '../ConfigContext';
import { Description, ResolvedValue, ConfigResolver } from '../ConfigResolver';

export class ObjectResolver<I, O> implements ConfigResolver<I, O> {
  constructor(private definitions: ConfigDefinitions<O>, private type?: new () => O) {}

  describe(name: string): Description {
    return new Config(this.definitions, new ConfigContext({}, [], false), `${name}.`).describe();
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<O> {
    // @TODO proper error handling, recommend an alternative class to Config
    const values = new Config(this.definitions, context, `${last.name}.`).resolve() as O;
    const value = this.type ? new this.type() : ({} as O);
    for (const key in values) {
      value[key] = values[key];
    }
    return { ...last, found: true, value, source: 'object' };
  }
}
