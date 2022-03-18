import { Middleware as KoaMiddleware } from 'koa';
import compose from 'koa-compose';
import { Method } from './interface';
import {
  getMetaData,
  getHandleMetaData,
  isProvided,
  provide,
  getProvide,
} from './meta';

export function Controller(baseUrl: string = '') {
  return function decorator(Class: any) {
    const metaData = getMetaData(Class);
    metaData.baseUrl = baseUrl;
    metaData.enable = true;
  };
}

function createMethodDecorator(method: Method) {
  return function (path?: string) {
    return function decorator(prototype: any, methodName: string) {
      const originFn = prototype[methodName];
      const metaData = getMetaData(prototype.constructor);
      const handleMetaInfo = getHandleMetaData(prototype.constructor, originFn);

      async function handle(ctx) {
        metaData.runtime.ctx = ctx;
        const args = [];
        handleMetaInfo.query.forEach((item) => {
          args[item.index] = ctx.query[item.name];
        });
        const result = await originFn.apply(this, args);
        ctx.body = result;
      }
      metaData.routes.push({
        path: path || `/${methodName}`,
        method,
        async handle(ctx) {
          metaData.runtime = {};
          await compose(handleMetaInfo.middleware)(ctx, handle.bind(this));
          metaData.runtime = null;
        },
      });
    };
  };
}

export const Get = createMethodDecorator('get');
export const Post = createMethodDecorator('post');
export const Put = createMethodDecorator('put');
export const Delete = createMethodDecorator('delete');

export function Query(name) {
  return function decorator(prototype: any, methodName: string, index: number) {
    const originFn = prototype[methodName];
    const handleMetaInfo = getHandleMetaData(prototype.constructor, originFn);
    handleMetaInfo.query.push({
      name,
      index,
    });
  };
}

export function Middleware(...next: KoaMiddleware[]) {
  return function decorator(prototype: any, methodName: string) {
    const originFn = prototype[methodName];
    const handleMetaInfo = getHandleMetaData(prototype.constructor, originFn);
    handleMetaInfo.middleware.push(...next);
  };
}

export function Context() {
  return function decorator(prototype: any, field: string) {
    const metaData = getMetaData(prototype.constructor);
    return {
      get() {
        return metaData.runtime.ctx;
      },
      set() {},
      configurable: true,
      enumerable: true,
    } as any;
  };
}

export function Inject<T>(Class?: any) {
  return function decorator(prototype: any, field: string) {
    let value: T;
    let enabled: Boolean = true;
    return {
      get() {
        if (!enabled) {
          return;
        }
        if (value) {
          return value;
        }
        if ((enabled = isProvided(Class || field))) {
          const Cls = getProvide(Class || field);
          return (value = new Cls());
        }
      },
      set() {},
      configurable: true,
      enumerable: true,
    } as any;
  };
}

export function Provide() {
  return function decorator(Class: any) {
    provide(Class);
  };
}
