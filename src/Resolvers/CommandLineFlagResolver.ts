import { ConfigSources } from "../ConfigSources";
import { ResolvedValue, Resolver } from "../Resolver";

export class CommandLineFlagResolver<I> implements Resolver<I, I|string> {
    constructor(private longFlag?: string, private shortFlag?: string) {}
    resolve(config: ConfigSources, last: ResolvedValue<I>): ResolvedValue<I|string> {
        const args = config.getArgs();
        let index = 0;
        const longFlag = this.longFlag || this.format(last.name);
        const prefixes = [`--${longFlag}`];
        if (this.shortFlag) {
            prefixes.push(`-${this.shortFlag}`)
        }
        while (index < args.length) {
            // Check for --flag value and -f value
            if (prefixes.some((prefix) => args[index] === prefix)) {
                const value = args[index + 1];
                return { ...last, found: true, value };
            }
            // Check for --flag=value and -f=value
            if (prefixes.some((prefix) => args[index].startsWith(`${prefix}=`))) {
                const value = args[index].split('=').slice(1).join('=');
                return { ...last, found: true, value };
            }
            index += 1;
        }
        return last;
    }

    private format(name: string): string {
        return name
            .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
            .replace(/_/g, '-')
            .toLowerCase();
    }
}
