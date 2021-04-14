import { ConfigContext } from './ConfigContext';

export type ResolvedValue<T = any> = FoundValue<T> | NotFoundValue;

export type FoundValue<T = any> = {
  name: string;
  found: true;
  value: T;
  source: string;
  options: string[];
  errors: string[];
};

export type NotFoundValue = {
  name: string;
  found: false;
  options: string[];
  errors: string[];
};

export type Description = (Record<string, string> & { name: string })[];

export interface Resolver<I, O> {
  describe(name: string): Description;
  resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<O>;
}
