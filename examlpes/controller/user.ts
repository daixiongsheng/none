import { Context as KoaContext } from 'koa';
import {
  Controller,
  Get,
  Middleware,
  Query,
  Context,
  Inject,
  Provide,
} from '../../src/decorator';

@Provide()
class Config {
  appInfo = 'hello World';
}

@Controller('/api')
class UserController {
  @Context()
  ctx: KoaContext;

  @Inject()
  config: Config;

  @Get('/home')
  get(@Query('id') id: string, @Query('name') name: string) {
    console.log(id, name);
    return 'hello world2';
  }

  @Get()
  @Middleware(
    async (ctx, next) => {
      console.log(3);
      await next();
      console.log(6);
    },
    async (ctx, next) => {
      console.log(4);
      await next();
      console.log(5);
    },
  )
  async getDate() {
    console.log(this.config, 'config');
    console.log('doing', this.ctx.url);
    return new Date().toString();
  }
}

export default UserController;
