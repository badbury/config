import { Config, DefinitionsResolved } from '../src/Config';
import { define } from '../src/facade';

export class AppConfigSchema {
  fooBar = define().default('default').envVar().flag();
  foo = define().default(true).envVar('THIS_VAR').map(Boolean);
  bar = define().default(1);
  baz = define()
    .default('Bosh')
    .envVar('TWO')
    .validate({
      'must begin with "B"': (baz: string) => baz[0] === 'B',
    });
  qux = define()
    .default('0')
    .envVar('QUX_DATE')
    .envDefault('testing', '999999999999')
    .flag('qux', 'q')
    .map((a) => new Date(Number(a)))
    .validate({
      'must be a week day': (date: Date) => date.getDay() !== 0 && date.getDay() !== 6,
    });
  obj = define().object(new NestedSchema());
}

export class NestedSchema {
  foo = define().default(1);
  bar = define().default('1');
}

export type AppConfig = DefinitionsResolved<AppConfigSchema>;

const config = new Config(new AppConfigSchema());

// config.get('bdddaz'); // Would produce compile time error
console.log('fooBar', config.get('fooBar'));
console.log('foo', config.get('foo'));
console.log('bar', config.get('bar'));
console.log('baz', config.get('baz'));
console.log('qux', config.get('qux'));
console.log('obj', config.get('obj'));
const appConfig: AppConfig = config.getAll();
console.log(appConfig);
