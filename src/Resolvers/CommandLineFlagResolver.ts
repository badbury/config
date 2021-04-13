import { ConfigContext } from "../ConfigContext";
import { ResolvedValue, Resolver } from "../Resolver";

export class CommandLineFlagResolver<I> implements Resolver<I, I|string> {

    constructor(private longFlag?: string, private shortFlag?: string) {}

    describe(name: string) {
        return [{ flag: this.getLongFlag(name) }];
    }

    resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<I|string> {
        let index = 0;
        const longFlag = this.getLongFlag(last.name);
        last.options.push(`flag ${longFlag}`);
        while (index < context.args.length) {
            // Check for --flag value
            if (context.args[index] === longFlag) {
                const value = context.args[index + 1];
                return { ...last, found: true, source: `${longFlag}=`, value };
            }
            // Check for --flag=value
            if (context.args[index].startsWith(`${longFlag}=`)) {
                const value = context.args[index].split('=').slice(1).join('=');
                return { ...last, found: true, source: `flag ${longFlag}=`, value };
            }
            index += 1;
        }
        return last;
    }

    private getLongFlag(name: string): string {
        return '--' + (this.longFlag || this.format(name));
    }

    private format(name: string): string {
        return name
            .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
            .replace(/_/g, '-')
            .replace(/\./g, '-')
            .toLowerCase();
    }
}
