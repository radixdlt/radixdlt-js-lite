export default class Messaging {
  constructor(connection) {
    this._connection = connection;
  }
  /**
   * Send a message.
   * @param {string} recipient - Destination address.
   * @param {string} message -  Message to be sent.
   * @returns {Subject}
   */
  sendMessage(recipient, message) {
    // Method: 'send_message'
    // Permissions: ['send_message']
    const params = {
      'recipient': recipient,
      'message': message
    };

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'send_message',
      'params': params,
      'id': 5
    });

    return this._connection.sendMessage;
  }
  /**
   * Get old and future messages.
   * @returns {Subject}
   */
  getMessages() {
    // Method: 'messages'
    // Permissions: ['messages']
    const params = {};

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'messages',
      'params': params,
      'id': 6
    });

    return this._connection.getMessages;
  }
  /**
   * Send an application message.
   * @param {string} applicationId - The application id.
   * @param {string[]} recipients - Destination addresses.
   * @param {Object} payload - Custom message.
   * @returns {Subject}
   */
  sendApplicationMessage(applicationId, recipients, payload, encrypted) {
    // Method: 'send_application_message'
    // Permissions: ['send_application_message']
    const params = {
      'application_id': applicationId,
      'recipients': recipients,
      'payload': payload,
      'encrypted': encrypted
    };

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'send_application_message',
      'params': params,
      'id': 7
    });

    return this._connection.sendApplicationMessage;
  }
  /**
   * Gets old and future application messages for a given application id.
   * @param {string} applicationId - The application id.
   * @returns {Subject}
   */
  getApplicationMessages(applicationId) {
    // Method: 'application_messages'
    // Permissions: ['application_messages']
    const params = {
      'application_id': applicationId
    };

    this._connection.pushRequest({
      'jsonrpc': '2.0',
      'method': 'application_messages',
      'params': params,
      'id': 8
    });

    return this._connection.getApplicationMessages;
  }
}
