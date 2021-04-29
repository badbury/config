import {
  Default,
  EnvDefault,
  EnvVar,
  Flag,
  fromDecoratedConfig,
  Nested,
  Transform,
  Validate,
} from '../src';

process.on('uncaughtException', (error) => {
  console.log(error);
  process.exit(1);
});

class ObjConfig {
  @Default(1)
  foo!: number;

  @Default('0')
  bar!: string;
}

class DecoratedConfig {
  @Default('default')
  @EnvVar()
  @Flag()
  fooBar!: string;

  @Default(true)
  @EnvVar('THIS_VAR')
  @Transform(Boolean)
  foo!: boolean;

  @Default(1)
  bar!: number;

  @Default('Bosh')
  @EnvVar('TWO')
  @Validate({
    'must begin with "B"': (baz: string) => baz[0] === 'B',
  })
  baz!: string;

  @Default('0')
  @EnvVar('QUX_DATE')
  @EnvDefault('testing', '999999999999')
  @Flag('qux', 'q')
  @Transform((timestamp) => new Date(Number(timestamp)))
  @Validate({
    'must be a week day': (date: Date) => date.getDay() !== 0 && date.getDay() !== 6,
  })
  qux!: Date;

  @Nested()
  obj!: ObjConfig;
}

const decoratedConfig = fromDecoratedConfig(DecoratedConfig);

// decoratedConfig.bdddaz; // Would produce compile time error
console.log('fooBar', decoratedConfig.fooBar);
console.log('foo', decoratedConfig.foo);
console.log('bar', decoratedConfig.bar);
console.log('baz', decoratedConfig.baz);
console.log('qux', decoratedConfig.qux);
console.log('obj', decoratedConfig.obj);
console.log(decoratedConfig);
