import glob from 'glob';
import Router from 'koa-router';
import { getRegister } from './src/decorator';
export function autoImport(dir) {
  const router = new Router();
  glob(`${dir}/**/*.ts`, async (err, files) => {
    if (!err) {
      files.forEach(async (v) => {
        try {
          let module = await import(v);
          module = module.default || module;
          const register = getRegister(module);
          register && register(new module(), router);
        } catch (e) {
          console.log('module load err', v, e.message);
        }
      });
    }
  });
  return router.routes();
}

export default autoImport;
