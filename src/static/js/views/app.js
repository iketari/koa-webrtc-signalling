export class AppView {
  constructor(websocket) {
    this.websocket = websocket;

    this.usernameInput = username; 
    this.register = register;
    this.start = start;
    this.stop = stop; 
    this.login = login;
    this.users = users;

    this.setupListeners();
    this.doLogin();
  }

  setupListeners() {
    this.register.addEventListener('click', this.onRegisterClick);
    this.login.addEventListener('click', this.doLogin);
    this.websocket.on('message', (msg) => this.onMessage(msg));
  }

  onRegisterClick = async () => {
    const username = this.usernameInput.value;
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username})
    });

    if (response.status === 201) {
      this.websocket.send({type: 'REGISTER'});
    }
  }

  doLogin = async (event) => {
    try {
      const username = await this._tryToLogin();
      this.usernameInput.value = username;
      this.websocket.send({type: 'REGISTER'});
    } catch(e) {
      console.warn('Need to register');
    }
  }

  onMessage(msg) {
    console.log(msg);
  }

  async _tryToLogin() {
    const { username } = await fetch('login').then(res => res.json());

    if (username) {
      this.websocket.setUsername(username);
      return Promise.resolve(username);
    }

    return Promise.reject();
  }
}