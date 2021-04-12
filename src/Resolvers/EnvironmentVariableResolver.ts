import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class EnvironmentVariableResolver implements Resolver<string> {
    constructor(private key?: string) {}
    resolve<I>(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|string> {
        const environment = config.getEnvironment();
        const value = this.key ? environment[this.key] : environment[this.format(last.name)];
        if (value) {
            return { ...last, found: true, value }
        }
        return last;
    }

    private format(name: string): string {
        return name
            .replace(/[A-Z]/g, letter => `_${letter}`)
            .toUpperCase();
    }
}
