import * as Koa from 'koa';

import * as views from 'koa-views';
import * as serve from 'koa-static';
import * as websockify from 'koa-websocket';
import * as session from 'koa-session';
import { join } from 'path';
import { config } from './config';
import { logger } from './logging';
import { routes } from './routes';
import { wsRoutes } from './ws-routes';


const app = new Koa();
websockify(app);
app.use(logger);

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));


app.use(serve(join(__dirname, './../static')));
app.use(views(join(__dirname, './../views'), {
  map: {
    pug: 'pug'
  }
}));

app.use(routes);
(app as websockify.App).ws.use(<any>wsRoutes);

app.listen(config.port);

console.log(`Server running on port ${config.port}`);