import Wallet from './wallet.js';
import Messaging from './messaging.js';
import Connection from './connection.js';

class ConnectionHandler {
  constructor(connection) {
    this._connection = connection;
  }
  get token() {
    return this._connection.token;
  }
  /**
   * Close the web-socket connection.
   */
  deregister() {
    this._connection.close();
  }
  /**
   * Return a Wallet instance.
   * @returns {Wallet}
   */
  getWallet() {
    if (this._connection) {
      return new Wallet(this._connection);
    }
    return null;
  }
  /**
   * Return a Messaging instance.
   * @returns {Messaging}
   */
  getMessaging() {
    if (this._connection) {
      return new Messaging(this._connection);
    }
    return null;
  }
  /**
   * Get the address of the current wallet.
   * @returns {Subject}
   */
  getAddress() {
    // Method: 'address'
    // Permissions: ['address']
    const params = {};

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'address',
      'params': params,
      'id': 1
    });

    return this._connection.getAddress;
  }
}

/**
 * Register an App.
 * @param {string} name - App's name.
 * @param {string} description -  App's description.
 * @param {string[]} permissions -  Permissions requested by this App.
 * @returns {Promise}
 */
function registerApp(name, description, permissions) {
  const CONNECTION = new Connection();

  return new Promise((resolve, reject) => {
    CONNECTION.register(name, description, permissions)
      .then(() => resolve(new ConnectionHandler(CONNECTION)))
      .catch((error) => reject(error));
  });
}

/**
 * Re-connects an App with a valid token.
 * @param {string} token - Auth token.
 * @returns {Promise}
 */
function connectApp(token) {
  const CONNECTION = new Connection();

  return new Promise((resolve, reject) => {
    CONNECTION.connect(token)
      .then(() => resolve(new ConnectionHandler(CONNECTION)))
      .catch((error) => reject(error));
  });
}

export default { registerApp, connectApp };
