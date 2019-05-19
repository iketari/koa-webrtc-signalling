export class UserListView {
  construtor(el) {
    this.el = el;
    this.data = {
      users: []
    };
  }

  render() {
    this.el.innerHTML = `
      <ul>${this._getItemsHtml()}<ul>
    `;
  }

  setData(data) {
    this.data = data;
  }

  _getItemsHtml() {
    return this.data.users.reduce((html, user) => {
      return html += `<li data-username="${user}">${user}</li>`
    }, '');
  }
}