// Step 1. npm init -y
// Step 2. npm install jsonwebtoken
// Step 3. create an index.js file and paste the below code
const { Web3Auth } = require("@web3auth/node-sdk");
const { EthereumPrivateKeyProvider } = require("@web3auth/ethereum-provider");

const jwt = require("jsonwebtoken");
const fs = require("fs");

// IMP START - Dashboard Registration
const clientId =
  "BEfX7IR2IrZiW8YZdK1EI46T414IQg2t0ghHq5iUUwlt08G-VRSauNQO2BAeFdFf4RJmpc9jmrrJWC82VEHq38A"; // Get your Client ID from Web3Auth Dashboard
// IMP END - Dashboard Registration

// IMP START - Verifier Creation
const verifier = "web3auth-custom-jwt";
// IMP END - Verifier Creation

// IMP START - SDK Initialization

// IMP END - SDK Initialization

// openssl genrsa -out privateKey.pem 2048
var privateKey = fs.readFileSync("privateKey.pem");
// openssl rsa -in privateKey.pem -pubout -out publicKey.pem
// var publicKey = fs.readFileSync("publicKey.pem");
// https://my-authz-server/.well-known/jwks.json -> publicKey to be used in Custom Authentication as JWK Endpoint.
// Check out below to convert PEM to JWKS

// var token = jwt.sign(
//   {
//     sub: "123", // must be unique to each user
//     name: "Nikola Tesovic",
//     email: "ntesovic27@gmail.com",
//     aud: "urn:my-resource-server", // -> to be used in Custom Authentication as JWT Field
//     iss: "https://raw.githubusercontent.com/teske00/jwk/main/jwk.json", // -> to be used in Custom Authentication as JWT Field
//     iat: Math.floor(Date.now() / 1000),
//     exp: Math.floor(Date.now() / 1000) + 60 * 60,
//   },
//   privateKey,
//   { algorithm: "RS256", keyid: "56786823be625c80856c0b3e25843" } // <-- Replace it with your kid. This has to be present in the JWKS endpoint.
// );

// console.log(token);

// const connect = async () => {
//   // IMP START - Login
//   const provider = await web3auth.connect({
//     verifier: "verifier", // replace with your verifier name
//     verifierId: "ntesovic27@gmail.com", // replace with your verifier id's value, for example, sub value of JWT Token, or email address.
//     idToken: token, // replace with your newly created unused JWT Token.
//   });
//   // IMP END - Login
//   const eth_private_key = await provider.request({ method: "eth_private_key" });
//   console.log("ETH PrivateKey: ", eth_private_key);
//   const eth_address = await provider.request({ method: "eth_accounts" });
//   console.log("ETH Address: ", eth_address[0]);
//   process.exit(0);
// };
// connect();
// Step 4. open terminal inside the vscode and type
// openssl genrsa -out privateKey.pem 2048
// This is the private key used to sign the JWT.
// Step 5. inside the vscode terminal type
// openssl rsa -in privateKey.pem -pubout -out publicKey.pem
// This is the public key used to verify the JWT. This is the key that is used to make JWKS.
// Check out below to convert PEM to JWKS
// Store it in gist, public folder or somewhere else that is accessible to the public.
// like this endpoint: https://my-authz-server/.well-known/jwks.json
// Step 6. Create the JWT Verifier in Web3Auth Dashboard as per the above fields of JWT.
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: {
      chainNamespace: "eip155",
      chainId: "0xaa36a7",
      rpcTarget: "https://rpc.ankr.com/eth_sepolia",
      displayName: "Ethereum Sepolia",
      blockExplorerUrl: "https://sepolia.etherscan.io/",
      ticker: "ETH",
      tickerName: "Ethereum",
    },
  },
});

const web3auth = new Web3Auth({
  clientId: clientId, // Get your Client ID from the Web3Auth Dashboard
  web3AuthNetwork: "sapphire_devnet",
  usePnPKey: false, // Setting this to true returns the same key as PnP Web SDK, By default, this SDK returns CoreKitKey.
});

web3auth.init({ provider: privateKeyProvider });

const user = {
  id: "1234", // must be unique to each user
  name: "Nikola Tesovic",
  email: "ntesovic7@gmail.com",
};

const connect = async () => {
  const web3authNodeprovider = await web3auth.connect({
    verifier: verifier, // e.g. `web3auth-sfa-verifier` replace with your verifier name, and it has to be on the same network passed in init().
    verifierId: user.email, // e.g. `Yux1873xnibdui` or `name@email.com` replace with your verifier id(sub or email)'s value.
    idToken: jwt.sign(
      {
        sub: user.id, // must be unique to each user
        name: user.name,
        email: user.email,
        aud: "urn:my-resource-server", // -> to be used in Custom Authentication as JWT Field
        iss: "https://raw.githubusercontent.com/teske00/jwk/main/jwk.json", // -> to be used in Custom Authentication as JWT Field
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      privateKey,
      { algorithm: "RS256", keyid: "56786823be625c80856c0b3e25843" }
    ), // or replace it with your newly created unused JWT Token.
  });
  const ethPrivateKey = await web3authNodeprovider.request({
    method: "eth_private_key",
  });
  // The private key returned here is the CoreKitKey
  console.log("ETH Private Key", ethPrivateKey);
};
connect();
