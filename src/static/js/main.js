'use strict';


import {WebSocketController} from './modules/websocket.js';
import {AppView} from './views/app.js';


let ws = new WebSocketController();
window.view = new AppView(ws);
