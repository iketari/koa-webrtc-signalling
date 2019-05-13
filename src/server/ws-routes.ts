import * as Router from 'koa-router';

const ws = new Router();

export enum WSMessageTypes {
  REGISTER = 'REGISTER',
  OFFER = 'OFFER',
}

export enum WSMessageErrors {
  WRONG_MSG_FORMAT = 'WRONG_MSG_FORMAT',
}

export interface IWSMessage {
  type: WSMessageTypes;
  from: string;
  to?: string;
}

const users: {[key: string]: Router.IRouterContext} = {};

ws.get('/signalling', (ctx) => {

  const send = (data: object) => ctx.websocket.send(JSON.stringify(data));

  ctx.websocket.on('open', () => {

  });

  ctx.websocket.on('message', (message: string) => {
      let messageObj: IWSMessage = null;

      try {
        messageObj = JSON.parse(message);
      } catch (e) {
        send({error: WSMessageErrors.WRONG_MSG_FORMAT, e});
        return;
      }

      switch (messageObj.type) {
        case WSMessageTypes.REGISTER: {

          users[messageObj.from] = ctx;
          
          // send response
        }

        default:
          break;
      }

  });
});

export const wsRoutes = ws.routes();
export const wsAllowedMethods = ws.allowedMethods();
