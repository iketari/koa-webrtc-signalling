import * as Router from 'koa-router';

const ws = new Router();

export enum WSMessageTypes {
  REGISTER = 'REGISTER',
  OFFER = 'OFFER',
}

export interface IWSMessage {
  type: WSMessageTypes;
  from: string;
  to?: string;
}

ws.get('/signalling', (ctx) => {

  ctx.websocket.on('message', (message: string) => {
      let messageObj: IWSMessage = null;

      try {
        messageObj = JSON.parse(message);
      } catch (e) {
        console.log(e);
      }

      switch (messageObj.type) {
        case WSMessageTypes.REGISTER: {

        }

        default:
          break;
      }

  });
});

export const wsRoutes = ws.routes();
export const wsAllowedMethods = ws.allowedMethods();
