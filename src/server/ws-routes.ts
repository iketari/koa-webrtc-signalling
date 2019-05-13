import * as Router from 'koa-router';

const ws = new Router();

export enum WSMessageTypes {
  REGISTER = 'REGISTER',
  USER_LIST= 'USER_LIST',
  OFFER = 'OFFER',
  ERROR = 'ERROR'
}

export enum WSMessageErrors {
  WRONG_MSG_FORMAT = 'WRONG_MSG_FORMAT',
}

export interface IWSMessage {
  type: WSMessageTypes;
  from?: string;
  to?: string;
  payload?: any;
}

const users: {[key: string]: Router.IRouterContext} = {};

ws.get('/signalling', (ctx) => {

  const send = (data: IWSMessage) => ctx.websocket.send(JSON.stringify({
    ...data,
    to: ctx.session.username
  }));

  if (ctx.session.isNew) {
    console.log('new user')
  } else {
    console.log('username', ctx.session.username);
  }

  ctx.websocket.on('open', () => {

  });

  ctx.websocket.on('message', (message: string) => {
      let messageObj: IWSMessage = null;

      try {
        messageObj = JSON.parse(message);
      } catch (e) {
        send({
          type: WSMessageTypes.ERROR,
          payload: {
            error: WSMessageErrors.WRONG_MSG_FORMAT,
            e
          }
        });
        return;
      }

      switch (messageObj.type) {
        case WSMessageTypes.REGISTER: {

          users[messageObj.from] = ctx;

          ctx.session.username = messageObj.from;
          ctx.session.save();

          send({
              type: WSMessageTypes.USER_LIST,
              payload: []
            }
          );
        }

        default:
          break;
      }

  });
});

export const wsRoutes = ws.routes();
export const wsAllowedMethods = ws.allowedMethods();
