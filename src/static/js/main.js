'use strict';


let ws = new WebSocket(`ws://${location.host}/signalling`);

ws.addEventListener('open', () => {
  ws.send('hi!!');
});

ws.addEventListener('message', () => {
  console.log('Message');
});


window.ws = ws;
