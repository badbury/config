import * as config from "../src";

config.init({
    foo: config.define().default(true).envVar('THIS_VAR').map(Boolean),
    bar: config.define().default(1),
    baz: config.define().default('Bosh').forEnv('test', 'Bash').envVar('TWO').validate({
        'must begin with "B"': (baz: string) => baz[0] === 'B'
    }),
    qux: config.define()
        .default('0')
        .envVar('QUX_DATE')
        .custom('quxDate')
        .forEnv('testing', '999999999999')
        .flag('qux', 'q')
        .map((a) => new Date(Number(a)))
        .validate({
            'must be a week day': (date: Date) => date.getDay() !== 0 && date.getDay() !== 6
        }),
});

// config.get('bdddaz'); // Would throw exception
console.log('foo', config.get('foo'));
console.log('bar', config.get('bar'));
console.log('baz', config.get('baz'));
const appConfig = config.getAll()
console.log(appConfig);
