import Router from 'koa-router';
import { MetaData, HandleMeta } from './interface';

const provides = new Map<string, any>();
const metaMap = new Map<any, MetaData>();

function getProvideKey(target: any) {
  const name = String(target.name || target);
  return name.charAt(0).toLowerCase() + name.slice(1);
}

export function isProvided(target: any) {
  return provides.has(getProvideKey(target));
}

export function provide(target: any) {
  provides.set(getProvideKey(target), target);
}

export function getMetaData(target: any): MetaData {
  if (metaMap.has(target)) {
    return metaMap.get(target);
  }
  const metaData: MetaData = {
    baseUrl: '',
    routes: [],
    enable: false,
    register(instance: any, router: Router) {
      metaData.routes.forEach((route) => {
        router[route.method](metaData.baseUrl + route.path, async (ctx) => {
          await route.handle.call(instance, ctx);
        });
      });
    },
    handleMap: new Map(),
    runtime: {},
  };
  metaMap.set(target, metaData);
  return metaData;
}

export function getHandleMetaData(parent: any, target: any): HandleMeta {
  const metaInfo = getMetaData(parent);
  if (metaInfo.handleMap.has(target)) {
    return metaInfo.handleMap.get(target);
  }
  const handleMetaInfo: HandleMeta = {
    query: [],
    middleware: [],
  };
  metaInfo.handleMap.set(target, handleMetaInfo);
  return handleMetaInfo;
}

export function getProvide(target: any) {
  return provides.get(getProvideKey(target));
}

export function getRegister(module) {
  let register = null;
  if (metaMap.has(module)) {
    const meta = metaMap.get(module);
    meta.enable && (register = meta.register.bind(meta));
  }
  return register;
}
