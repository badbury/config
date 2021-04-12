import {
    ConfigSources,
    Custom,
    Default,
    EnvDefault,
    EnvVar,
    Flag,
    fromDecoratedConfig,
    Transform,
    Validate,
} from "../src";

class DecoratedConfig {

    @Default('default')
    @EnvVar()
    @Flag()
    fooBar!: string

    @Default(true)
    @EnvVar('THIS_VAR')
    @Transform(Boolean)
    foo!: boolean;

    @Default(1)
    bar!: number;

    @Default('Bosh')
    @EnvVar('TWO')
    @Validate({
        'must begin with "B"': (baz: string) => baz[0] === 'B'
    })
    baz!: string;

    @Default('0')
    @EnvVar('QUX_DATE')
    @Custom('quxDate')
    @EnvDefault('testing', '999999999999')
    @Flag('qux', 'q')
    @Transform((timestamp) => new Date(Number(timestamp)))
    @Validate({
        'must be a week day': (date: Date) => date.getDay() !== 0 && date.getDay() !== 6
    })
    qux!: Date;
}

const decoratedConfig = fromDecoratedConfig(DecoratedConfig, new ConfigSources({quxDate: '1499999999999'}));

// decoratedConfig.bdddaz // Would produce compile time error
console.log('foo', decoratedConfig.foo);
console.log('bar', decoratedConfig.bar);
console.log('baz', decoratedConfig.baz);
console.log('qux', decoratedConfig.qux.getDay());
console.log(decoratedConfig);
