export default class Wallet {
  constructor(connection) {
    this._connection = connection;
  }
  /**
   * Get the balance.
   * @returns {Subject}
   */
  getBalance() {
    // Method: 'balance'
    // Permissions: ['balance']
    const params = {};

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'balance',
      'params': params,
      'id': 2
    });

    return this._connection.getBalance;
  }
  /**
   * Send a transaction.
   * @param {string} recipient - Destination address.
   * @param {string} asset -  Asset ISO.
   * @param {number} quantity - Amount to be sent (up to 5 decimals).
   * @returns {Subject}
   */
  sendTransaction(recipient, asset, quantity, message) {
    // Method: 'send_transaction'
    // Permisions: ['send_transactions']
    const params = {
      'recipient': recipient,
      'asset': asset,
      'quantity': quantity,
      'message': message
    };

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'send_transaction',
      'params': params,
      'id': 3
    });

    return this._connection.sendTransaction;
  }
  /**
   * Get old and future transactions.
   * @returns {Subject}
   */
  getTransactions() {
    // Method: 'transactions'
    // Permissions: ['transactions']
    const params = {};

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'transactions',
      'params': params,
      'id': 4
    });

    return this._connection.getTransactions;
  }
}
