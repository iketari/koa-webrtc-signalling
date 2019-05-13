'use strict';


import {WebSocketController} from './modules/websocket.js';
import {MainView} from './modules/view.js';


let ws = new WebSocketController();
window.view = new MainView(ws);
