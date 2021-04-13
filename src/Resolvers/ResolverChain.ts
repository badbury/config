import { ConfigContext } from "../ConfigContext"
import { ResolvedValue, Resolver } from "../Resolver"

export class ResolverChain<
    I, M, O,
    A extends Resolver<I, M>,
    B extends Resolver<M, O>,
> implements Resolver<I, O> {
    constructor(
        private first: A,
        private second: B,
    ) {}

    resolve(context: ConfigContext, last: ResolvedValue<I>): ResolvedValue<O> {
        const next = this.first.resolve(context, last)
        return this.second.resolve(context, next)
    }
}
