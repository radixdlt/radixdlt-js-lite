/* global describe, it, before */

import chai from 'chai';
import { registerApp } from '../lib/radixdlt-js-lite';

const name = 'Cashgrab';
const description = 'Takes all your money, I don\'t even know why you would accept this';
const permissions = [
  'address',
  'balance',
  'send_transaction',
  'send_message',
  'transactions',
  'messages',
  'application_messages'
];

let connection = null;
let wallet = null;
let messaging = null;

describe('When I register my App', () => {
  it('should resolve the promise', (done) => {
    const resolvingPromise = registerApp(name, description, permissions);

    resolvingPromise.then((result) => {
      connection = result;
      done();
    });
  });
});

describe('Given an instance of my Wallet library', () => {
  before(() => {
    wallet = connection.getWallet();
  });
  describe('when I need all the transactions', () => {
    it('should return a Subject object with a subscribe method', () => {
      chai.expect(wallet.getTransactions().subscribe).to.exist;
    });
  });
  describe('when I want to get the balance', () => {
    it('should return a Subject object with a subscribe method', () => {
      chai.expect(wallet.getBalance().subscribe).to.exist;
    });
  });
});

describe('Given an instance of my Messaging library', () => {
  before(() => {
    messaging = connection.getMessaging();
  });
  describe('when I need all the messages', () => {
    it('should return a Subject object with a subscribe method', () => {
      chai.expect(messaging.getMessages().subscribe).to.exist;
    });
  });
});

describe('When I deregister my App', () => {
  before(() => {
    connection.deregister();
  });
  it('should close the connection properly', () => {
    setTimeout(() => {
      chai.expect(connection._connection._socket.readyState).to.not.be.equal(1);
    }, 2000);
  });
});
