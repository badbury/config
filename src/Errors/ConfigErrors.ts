
export class ConfigErrors extends Error {
    public message = 'Config errors';
    public name = 'ConfigErrors';
    constructor(
        public errors: Error[],
    ) {
        super();
        const errorMessages = this.errors.map((error) => ' - ' + error.message).join('\n')
        this.message = `${this.message}: \n${errorMessages}`;
    }
}
