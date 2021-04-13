
export class InvalidConfig extends Error {
    public name = 'InvalidConfig';
    public message = 'Invalid config';
    public configKey: string;
    public configValue: any;
    public reasons: string[];

    constructor(configKey: string, configValue: any, reasons: string[], source: string) {
        super();
        const reason = reasons.join(' and ');
        const value = JSON.stringify(configValue);
        this.message = `${this.message} for ${configKey}. Using ${source}${value} but ${reason}`;
        this.configKey = configKey;
        this.configValue = configValue;
        this.reasons = reasons;
    }
}
