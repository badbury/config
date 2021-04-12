import { ConfigSources } from "./ConfigSources"
import { ConfigDefinition } from "./ConfigDefinition"
import { Config } from "./Config"
import { define } from "./facade";

const foo = (new ConfigDefinition('foo')).default(1).envVar('WHAYAYAA').map(Number).optional()
const fooValue = foo.resolveAndExtract(new ConfigSources)
console.log(fooValue);

const ssss = define('foo').default(true).envVar('THIS_VAR').map(Boolean);


const configSchema = {
    foo: define().default(true).envVar('THIS_VAR').map(Boolean),
    bar: define().default(1),
    baz: define().default('Bosh').envVar('TWO'),
}
const config2 = new Config(configSchema);

const ddd2 = config2.get('foo');
// const ffgggf2 = config2.get('bdddaz');
const fjfjfj2 = config2.getAll();
console.log(fjfjfj2.foo)
