import { Config } from "../src/Config";
import { ConfigErrors } from "../src/Errors/ConfigErrors";
import { define } from "../src/facade";

const config = new Config({
    fooBar: define().default('default').envVar().flag(),
    foo: define().default(true).envVar('THIS_VAR').map(Boolean),
    bar: define().flag().validate({
        'must not be empty': (value) => value.length > 0
    }),
    baz: define().default('Josh').envVar('TWO').validate({
        'must begin with the letter B': (baz) => baz[0] === 'B'
    }),
    obj: define().object({
        foo: define().default(1),
        bar: define().object({
            tax: define().envVar().flag(),
            tox: define().default(11.5).validate({
                'must be greater than one': (num) => num > 1,
                'must be less than seven': (num) => num < 7,
                'must be a whole number': (num) => Math.floor(num) === num,
            })
        })
    }),
    qux: define()
        .default('0')
        .envVar('QUX_DATE')
        .envDefault('testing', '123456789')
        .flag('qux', 'q')
        .map((a) => new Date(Number(a)))
        .validate({
            'must be a week day': (date: Date) => date.getDay() !== 0 && date.getDay() !== 6
        }),
});

try {
    console.log(config.describe());
    const appConfig = config.getAll();
    console.log(appConfig);
} catch (e) {
    const error: ConfigErrors = e;
    console.log(JSON.stringify(error));
    console.log((error.objectSummary()));
    console.error(error);
}
