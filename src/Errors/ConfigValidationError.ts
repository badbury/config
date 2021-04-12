
export class ConfigValidatonError extends Error {
    public message = 'Invalid config value';
    public name = 'ConfigValidatonError';
    constructor(
        public configKey: string,
        public configValue: any,
        public errors: string[],
    ) {
        super();
        this.message = `${this.message} ${this.configValue} for key "${this.configKey}": ${this.errors.join(' and ')}`;
    }
}
