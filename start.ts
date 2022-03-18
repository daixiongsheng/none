import koa from 'koa';
import autoImport from './autoImport';
import { resolve } from 'path';

const app = new koa();
app.use(async (ctx, next) => {
  console.log('start==========>');
  try {
    await next();
  } catch (e) {
    console.log('error', e.message);
  }
  console.log('end<============');
});

app.use(autoImport(resolve(__dirname, 'controller')));

app.listen('8008', () => {
  console.log('listen on 8008');
});

app.on('error', (e) => {});
