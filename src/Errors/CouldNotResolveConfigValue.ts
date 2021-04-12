
export class CouldNotResolveConfigValue extends Error {
    public message = 'Could not resolve config value';
    public name = 'CouldNotResolveConfigValue';
    constructor(
        public configKey: string,
    ) {
        super();
        this.message = `${this.message} for key "${this.configKey}"`
    }
}