require('dotenv').config({ path: __dirname + '/../.env' });

const xrpl = require('xrpl');
const { default: ECDSA } = require('xrpl/dist/npm/ECDSA');
const { createHash } = require("crypto");
const { default: BigNumber } = require('bignumber.js');
const { transactionMockHandler } = require('../mock/transaction')

const log = require('bunyan').createLogger({ name: 'ripple_methods' })
delete log.fields.hostname;

const estimate_fee_query = {
  "id": "EstimateFee",
  "command": "fee"
};

/**
 * given a string, returns an object connected to the ripple webhooks
 * 
 * @param {string} server 
 * 
 * @returns {Client}
 */
async function get_connection(server) {
  let client = new xrpl.Client(server);
  await client.connect();
  return client;
}

/**
 * given a client object, terminates the connection of the client object
 * 
 * @param {Client} client 
 * 
 * @return void 
 */
async function terminate_connection(client) {
  await client.disconnect();
}

/**
 * sends a query to the webhook to recieve an object representing the required fees
 * 
 * @param {Client} client 
 * 
 * @returns object
 */
async function request_fee(client) {
  return client.request(estimate_fee_query);
}

/**
 * given a string representing the network to connect to
 * return the open ledger fee and median fee
 * 
 * @param {string} server 
 * 
 * @returns object
 */
async function get_estimated_ripple_fee(server) {
  try {

    let client = await get_connection(server);
    let response = await request_fee(client);
    await terminate_connection(client);

    //returns the maximum between the local base fee check and open_ledger check
    let data = {
      median_fee: parseInt(response.result.drops.median_fee),
      open_ledger_fee: parseInt(response.result.drops.open_ledger_fee),
    }
    return data;
  } catch {
    throw new Error("Internal ripple error");
  }

}

/**
 * 
 * @param {object} query
 * 
 * @returns bool 
 */
function is_query_validator(query) {

  // checks for query type
  if (query.TransactionType != "Payment") return false;
  if (!query.Account) return false;
  if (!query.Destination) return false;
  if (!query.Amount) return false;
  if (!query.Fee) return false;

  // checks to make sure amount only contains numbers
  for (digit of query.Amount) {
    if (digit == '.') continue;
    if (isNaN(parseInt(digit))) {
      return false
    }
  }

  // checks to make sure fee only contains numbers
  for (digit of query.Fee) {
    if (digit == '.') continue;
    if (isNaN(parseInt(digit))) {
      return false
    }
  }

  // checks for Account wallet details
  if (query.Account.length < 25 || query.Account.length > 35) return false

  for (char of query.Account) {
    if (char === 'O' || char === '0' || char == 'I' || char == 'l') return false
  }
  // checks for destination wallet details
  if (query.Destination.length < 25 || query.Destination.length > 35) return false

  for (char of query.Destination) {
    if (char === 'O' || char === '0' || char == 'I' || char == 'l') return false
  }

  return true;
}

/**
 * Sends a query to the ripple webhook
 * only return once the transaction has gone through
 * 
 * @param {*} server 
 * @param {*} query 
 * @param {*} walletFromSeed 
 * 
 * @returns void
 */
async function send_token(server, query, walletFromSeed) {

  if(process.env.NODE_ENV =='test')
  {
    result_hash = await transactionMockHandler(query);
    return result_hash;
  }
  console.log('next   ')
  let client = await get_connection(server);
  let wallet = {};

  if (!is_query_validator(query)) return;

  // scaling from amount to Ripple amount
  query.Amount = parseFloat(query.Amount) * 1000000;
  query.Fee = parseFloat(query.Fee) * 1000000;

  query.Amount = query.Amount.toString();
  query.Fee = query.Fee.toString();

  // generate the wallet from either the secret seed for testing
  if (walletFromSeed.length == 29) {
    wallet = xrpl.Wallet.fromSeed(walletFromSeed);
  }
  else {
    wallet = xrpl.Wallet.fromEntropy(walletFromSeed, { algorithm: ECDSA });
  }
  // Fills in transaction with meta data
  const prepared = await client.autofill(query);
  const signed = wallet.sign(prepared);

  // // submit to blockchain
  let tx = {};
  try {
    tx = await client.submitAndWait(signed.tx_blob)
  } catch (err) {
    log.error(err, "failed to send tokens");
  }
  return tx;
}
/**
 * Publishes a transaction onto the blockchain and returns the txhash
 * without waiting for the transaction to finish
 * 
 * @param {string} server 
 * @param {object} query 
 * @param {string} walletFromSeed 
 * 
 * @returns string
 */
async function publish_transaction(server, query, walletFromSeed) {

  let client = await get_connection(server);
  let wallet = {};

  if (!is_query_validator(query)) throw new Error('Inputed values are invalid')


  query.Amount = parseFloat(query.Amount) * 1000000;
  query.Fee = parseFloat(query.Fee) * 1000000;

  query.Amount = query.Amount.toString();
  query.Fee = query.Fee.toString();

  // generate the wallet from either the secret seed for testing
  if (walletFromSeed.length == 29) {
    wallet = xrpl.Wallet.fromSeed(walletFromSeed);
  }
  else {
    wallet = xrpl.Wallet.fromEntropy(walletFromSeed, { algorithm: ECDSA });
  }

  // If there is a destination tag, make sure that it is a number
  // For example, 7ab would not be a number
  if (query.DestinationTag && !isNaN(Number(query.DestinationTag))) query.DestinationTag = Number(query.DestinationTag);
  else delete query.DestinationTag

  // Fills in transaction with meta data
  try {
    const prepared = await client.autofill(query);
    const signed = wallet.sign(prepared);

    // // submit to blockchain
    let tx = {};
    tx = client.submitAndWait(signed.tx_blob)

    log.info({ hash: signed.hash }, "hash of the executed transaction");
    return signed.hash;
  } catch (e) {
    throw new Error('Something went wrong when sigining the transaction')
  }
}

/**
 * Generate or re-create an address
 * 
 * @param {string} key - optional
 * 
 * @return {object|null}
 * @throws {error}
 */
function generate_address(key) {
  if (key !== undefined && key !== null) {
    if (key.length != 64 || key !== key.toLowerCase()) {
      throw new Error("Invalid key supplied");
    }
  }

  var privateKey = key || null;

  if (privateKey === null) {
    // Hash the newly generated privateKey and use that as mnemonic to
    privateKey = createHash('sha256')
      .update(xrpl.Wallet.generate().privateKey)
      .digest('hex')
  }

  const entropy = (new BigNumber(privateKey, 16)).toFormat({ prefix: '' });
  const keypair = xrpl.Wallet.fromEntropy(entropy.split('').map(Number), { algorithm: 'ecdsa-secp256k1' })

  return {
    private: privateKey,
    public: keypair.publicKey,
    address: keypair.address,
  };
}

module.exports = {
  publish_transaction,
  get_estimated_ripple_fee,
  request_fee,
  get_connection,
  terminate_connection,
  send_token,
  is_query_validator,
  generate_address
}
