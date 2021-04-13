
export class ConfigContext {

    constructor(
        public readonly environment: Readonly<Partial<Record<string, string>>> = process.env,
        public readonly args: Readonly<string[]> = process.argv,
        public readonly hideValuesInErrors: boolean = false,
    ) {}
}
