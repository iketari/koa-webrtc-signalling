import * as Koa from 'koa';

import * as views from 'koa-views';
import * as serve from 'koa-static';
import * as websockify from 'koa-websocket';
import { join } from 'path';
import { config } from './config';
import { logger } from './logging';
import { routes } from './routes';
import { wsRoutes } from './ws-routes';


const app = new Koa();
websockify(app);

app.use(logger);

app.use(serve(join(__dirname, './../static')));
app.use(views(join(__dirname, './../views'), {
  map: {
    pug: 'pug'
  }
}));

app.use(routes);
(app as websockify.App).ws.use(wsRoutes);

app.listen(config.port);

console.log(`Server running on port ${config.port}`);