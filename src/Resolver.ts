import { ConfigSources } from "./ConfigSources";

export type ResolvedValue<T = any> = FoundValue<T> | NotFoundValue

export type FoundValue<T = any> = {
    name: string;
    found: true;
    value: T;
    errors: string[];
}

export type NotFoundValue = {
    name: string;
    found: false;
    errors: string[];
}

export interface Resolver<I, O> {
    resolve(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<O>
}
