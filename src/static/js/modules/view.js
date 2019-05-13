export class MainView {
  constructor(websocket) {
    this.websocket = websocket;

    this.username = username; 
    this.register = register;
    this.start = start;
    this.stop = stop; 

    this.setupListeners();
  }

  setupListeners() {
    this.register.addEventListener('click', () => this.onRegisterClick());
    this.websocket.on('message', (msg) => this.onMessage(msg));
  }

  onRegisterClick() {
    this.websocket.setUsername(this.username.value);
    this.websocket.send({type: 'REGISTER'});
  }

  onMessage(msg) {
    console.log(msg);
  }
}