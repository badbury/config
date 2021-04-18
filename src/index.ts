export * from './Config';
export * from './ConfigDefinition';
export * from './ConfigContext';
export * from './Decorators';
export * from './facade';
export * from './Resolver';
import { Foo as FooOne } from './facade';

const m = new Map<any, any>();

class Foo {
  two = 2;
}
class Bar {}
class Baz {}

m.set(FooOne, new FooOne());
m.set(Foo, new Foo());
m.set(Bar, new Bar());
m.set(Baz, new Baz());

console.log(m);
