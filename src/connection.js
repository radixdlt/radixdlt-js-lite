import { Subject } from 'rxjs/Subject';

const WS = global.WebSocket || global.MozWebSocket || require('ws');

class Queue extends Subject {
  constructor() {
    super();
    this._items = [];
  }
  add(item) {
    if (this.observers.length > 0) {
      this.next(item);
    } else {
      this._items.push(item);
    }
  }
  subscribe(observer) {
    let s = super.subscribe(observer);

    this._items.forEach(item => this.next(item));
    this._items = [];
    return s;
  }
};

export default class Connection {
  constructor() {
    this._token = new Subject();
    this._messages = new Queue();

    this._getAddress = new Subject();
    this._getBalance = new Subject();
    this._sendTransaction = new Subject();
    this._getTransactions = new Subject();
    this._sendMessage = new Subject();
    this._getMessages = new Subject();
    this._sendApplicationMessage = new Subject();
    this._getApplicationMessages = new Subject();
  }
  get getAddress() {
    return this._getAddress;
  }
  get getBalance() {
    return this._getBalance;
  }
  get sendTransaction() {
    return this._sendTransaction;
  }
  get getTransactions() {
    return this._getTransactions;
  }
  get sendMessage() {
    return this._sendMessage;
  }
  get getMessages() {
    return this._getMessages;
  }
  get sendApplicationMessage() {
    return this._sendApplicationMessage;
  }
  get getApplicationMessages() {
    return this._getApplicationMessages;
  }
  get token() {
    return this._tokenValue;
  }
  register(name, description, permissions) {
    // Method: 'register'
    const request = JSON.stringify({
      jsonrpc: '2.0',
      method: 'register',
      params: {
        'name': name,
        'description': description,
        'permissions': permissions
      },
      id: 0
    });

    return new Promise((resolve, reject) => {
      this._socket = new WS('ws://localhost:54345');
      this._socket.onopen = () => this.handleOpen(request, resolve, reject);
      this._socket.onmessage = (evt) => this.handleResponse(evt.data);
      this._socket.onerror = (error) => reject(`WebSocket Error: ${JSON.stringify(error)}`);
      this._socket.onclose = () => this.handleClose();
    });
  }
  connect(token) {
    // Method: 'check_token'
    const request = JSON.stringify({
      jsonrpc: '2.0',
      method: 'ping',
      params: {
        'token': token
      },
      id: 9
    });

    this._tokenValue = token;

    return new Promise((resolve, reject) => {
      this._socket = new WS('ws://localhost:54345');
      this._socket.onopen = () => this.handleOpen(request, resolve, reject);
      this._socket.onmessage = (evt) => this.handleResponse(evt.data);
      this._socket.onerror = (error) => reject(`WebSocket Error: ${JSON.stringify(error)}`);
      this._socket.onclose = () => this.handleClose();
    });
  }
  handleOpen(request, resolve, reject) {
    this._socket.send(request);
    this._token.subscribe(
      token => {
        resolve();
        this._tokenValue = token;
        this._messages.subscribe(message => {
          message.params.token = token;
          message = JSON.stringify(message);
          this._socket.send(message);
        });
      },
      error => reject(error)
    );
  }
  handleResponse(response) {
    response = JSON.parse(response);
    if (response.hasOwnProperty('result') || response.hasOwnProperty('params')) {
      this.getResponse(response);
    } else {
      this.getError(response);
    }
  }
  getResponse(response) {
    switch (response.id) {
      case 0: // register
        this._token.next(response.result.token);
        break;
      case 1: // getAddress
        this._getAddress.next(response.result);
        break;
      case 2: // getBalance
      case 4: // getTransactions
      case 6: // getMessages
      case 8: // getApplicationMessages
        // console.log(response.result);
        break;
      case 3: // sendTransaction
        this._sendTransaction.next(response.result);
        break;
      case 5: // sendMessage
        this._sendMessage.next(response.result);
        break;
      case 7: // sendApplicationMessage
        this._sendApplicationMessage.next(response.result);
        break;
      case 9: // connect
        this._token.next(this._tokenValue);
        break;
      default:
        switch (response.method) {
          case 'balance.update':
            this._getBalance.next(response.params.TEST);
            break;
          case 'transaction.update':
            this._getTransactions.next(response.params);
            break;
          case 'message.update':
            this._getMessages.next(response.params);
            break;
          case 'application_message.update':
            this._getApplicationMessages.next(response.params);
            break;
          default:
            console.log('The method is not supported');
            break;
        }
        break;
    }
  }
  getError(response) {
    switch (response.id) {
      case 0: // register
        this._token.error(response.error);
        break;
      case 1: // getAddress
        this._getAddress.error(response.error);
        break;
      case 2: // getBalance
      case 4: // getTransactions
      case 6: // getMessages
      case 8: // getApplicationMessages
        // console.log(response.result);
        break;
      case 3: // sendTransaction
        this._sendTransaction.error(response.error);
        break;
      case 5: // sendMessage
        this._sendMessage.error(response.error);
        break;
      case 7: // sendApplicationMessage
        this._sendApplicationMessage.error(response.error);
        break;
      case 9: // connect
        this._token.error(response.error);
        break;
      default:
        console.log('The method is not supported');
        break;
    }
  }
  handleClose() {
    this._token.unsubscribe();
    this._messages.unsubscribe();
  }
  pushRequest(request) {
    this._messages.add(request);
  }
  close() {
    setTimeout(() => {
      if (this._socket.readyState === 1) {
        this._socket.close();
      }
    }, 2000);
  }
}
