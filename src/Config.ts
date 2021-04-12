import { ConfigDefinition } from "./ConfigDefinition";
import { ConfigSources } from "./ConfigSources";
import { ConfigErrors } from "./Errors/ConfigErrors";

export type ConfigDefinitions<T> = {
    [key in keyof T]: ConfigDefinition<T[key]>
};

export type DefinitionsResolved<T> = {
    [key in keyof T]: DefinitionResolved<T[key]>
};

type DefinitionResolved<T> = T extends ConfigDefinition<infer X> ? X : never;

export class Config<T extends Partial<Record<string, any>>> {

    constructor(
        private definitions: ConfigDefinitions<T>,
        private sources: ConfigSources = new ConfigSources,
    ) {
        for (const key in this.definitions) {
            this.definitions[key].name = key;
        }
    }

    get<X extends keyof T>(key: X): T[X] {
        return this.definitions[key].resolveAndExtract(this.sources);
    }

    getAll(): T {
        const result: T = {} as T;
        const errors = [];
        for (const key in this.definitions) {
            try {
                result[key] = this.definitions[key].resolveAndExtract(this.sources);
            } catch (error) {
                errors.push(error);
            }
        }
        if (errors.length > 0) {
            throw new ConfigErrors(errors);
        }
        return result;
    }
}
