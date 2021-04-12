
export class ConfigSources {

    constructor(
        private customValues: Partial<Record<string, any>> = {},
        private environment: Partial<Record<string, string>> = process.env,
        private args: string[] = process.argv,
    ) {}

    getCustomValues(): Record<string, any> {
        return this.customValues;
    }

    getEnvironment(): Partial<Record<string, string>> {
        return this.environment;
    }

    getArgs(): string[] {
        return this.args;
    }
}
