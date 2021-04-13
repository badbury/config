import { ConfigDefinition } from "./ConfigDefinition";
import { ConfigContext } from "./ConfigContext";
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
        private context: ConfigContext = new ConfigContext,
        prefix: string = '',
    ) {
        for (const key in this.definitions) {
            this.definitions[key].name = `${prefix}${key}`;
        }
    }

    get<X extends keyof T>(key: X): T[X] {
        return this.definitions[key].resolveAndExtract(this.context);
    }

    getAll(): T {
        const result: T = {} as T;
        const errors = [];
        for (const key in this.definitions) {
            try {
                result[key] = this.definitions[key].resolveAndExtract(this.context);
            } catch (error) {
                if (error instanceof ConfigErrors) {
                    errors.push(...error.errors)
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

    environmentVariables<X extends keyof T>(key: X): T[X] {
        return this.definitions[key].resolveAndExtract(this.context);
    }
}
