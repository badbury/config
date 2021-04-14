import { Config, ConfigDefinitions } from '../Config';
import { ConfigContext } from '../ConfigContext';
import { ResolvedValue, Resolver } from '../Resolver';

export class ObjectResolver<I, O> implements Resolver<I, O> {
  constructor(private definitions: ConfigDefinitions<O>) {}

  describe(name: string) {
    return new Config(this.definitions, new ConfigContext({}, [], false), `${name}.`).describe();
  }

  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<O> {
    // @TODO proper error handling, recommend an alternative class to Config
    const value = new Config(this.definitions, context, `${last.name}.`).getAll();
    return { ...last, found: true, value, source: 'object' };
  }
}
