import * as Koa from 'koa';

import * as views from 'koa-views';
import * as serve from 'koa-static';
import * as websockify from 'koa-websocket';
import * as session from 'koa-session';
import * as bodyParser from 'koa-bodyparser';
const koaSocketSession: any = require('koa-socket-session');
import { join } from 'path';
import { config } from './config';
import { logger } from './logging';
import { routes } from './routes';
import { wsRoutes } from './ws-routes';


const app = new Koa();
app.use(bodyParser());
websockify(app);
app.use(logger);

app.keys = ['some secret hurr'];

app.use(session({
  key: "SESSIONID",   //default "koa:sess"
}, app));

app.use(serve(join(__dirname, './../static')));
app.use(views(join(__dirname, './../views'), {
  map: {
    pug: 'pug'
  }
}));

app.use(routes);
(app as websockify.App).ws.use(<any>wsRoutes);
(app as websockify.App).ws.use(<any>koaSocketSession);

app.listen(config.port).on('listening', () => {
  console.log(`Server running on port ${config.port}`);
});