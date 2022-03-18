import koa from 'koa';
import autoImport from './autoImport';
import { resolve } from 'path';
export * from './decorator';

class None extends koa {
  constructor() {
    super();
  }
  start(...args) {
    this.use(autoImport(resolve(__dirname, 'controller')));
    super.listen(...args);
  }
}
export default None;
