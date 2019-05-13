
export class WebSocketController {
  active = false;
  username = null;

  callbacks = {};
  constructor() {
    const ws = new WebSocket(`ws://${location.host}/signalling`);
    this.ws = ws;

    ws.addEventListener('open', () => {
      this.active = true;
    });

    ws.addEventListener('close', () => {
      this.active = false;
    })

    ws.addEventListener('message', (event) => {
      this.trigger('message', event);
    });
  }

  on(eventName, cb) {
    if (!this.callbacks[eventName]) {
      this.callbacks[eventName] = [];
    }
    
    this.callbacks[eventName].push(cb);
  }

  trigger(eventName, data) {
    if (!this.callbacks[eventName]) {
      return;
    }

    this.callbacks[eventName].forEach(cb => cb(data));
  }

  setUsername(name) {
    this.username = name;
  }

  send(msg, to) {
    this.ws.send(JSON.stringify({
      from: this.username,
      to,
      ...msg
    }));
  }
}