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

  const currentUsername = ctx.session.username;

  if (!currentUsername) {
    ctx.throw(403, `User ${currentUsername} is not logged in`);
    return;
  }

  const send = (to: string) => {
    const toCtx = users[to];

    if (!toCtx) {
      throw new Error(`There is no user like ${to}`);
    }

    return (data: IWSMessage) => toCtx.websocket.send(JSON.stringify({
      ...data,
      to
    }));
  };

  const sendToAll = (data: IWSMessage) => {
    Object.keys(users).forEach(username => {
      send(username)(data);
    });
  }

  ctx.websocket.on('message', (message: string) => {
      let messageObj: IWSMessage = null;

      try {
        messageObj = JSON.parse(message);
      } catch (e) {
        send(ctx.session.username)({
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

          sendToAll({
            type: WSMessageTypes.USER_LIST,
            payload: Object.keys(users)
          });
        }

        case WSMessageTypes.OFFER: {

        }

        default:
          break;
      }

  });

  ctx.websocket.on('close', (code: string, reason: string) => {
    const unloggedUsername = ctx.session.username;

    delete users[unloggedUsername];

    sendToAll({
      type: WSMessageTypes.USER_LIST,
      payload: Object.keys(users)
    });
  });
});

export const wsRoutes = ws.routes();
export const wsAllowedMethods = ws.allowedMethods();
