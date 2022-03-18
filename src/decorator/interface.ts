import Router from 'koa-router';
import { Middleware } from 'koa';
export type HandleMeta = {
  query: QueryMeta[];
  middleware: Middleware[];
};

export type QueryMeta = {
  name: string;
  index: number;
};

export type MetaData = {
  baseUrl: string;
  routes: RouteInfo[];
  handleMap: Map<Function, HandleMeta>;
  register(instance: any, router: Router): any;
  enable: boolean;
  runtime: any;
};

export type Method = 'get' | 'post' | 'delete' | 'put';
export type RouteInfo = {
  path: string;
  method: Method;
  handle: Middleware;
};
