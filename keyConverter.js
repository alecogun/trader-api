import bs58 from 'bs58'

// Replace this array with your actual private key array
const privateKeyArray = [PRIVATE_KEY_HERE];

const privateKeyBuffer = Buffer.from(privateKeyArray);
const base58Key = bs58.encode(privateKeyBuffer);

console.log("Base58 Private Key:", base58Key);