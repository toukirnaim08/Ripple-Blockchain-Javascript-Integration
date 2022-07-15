## Ripple Development
Ripple blockchain crypto asset management solutions are faster, more transparent, and more cost-effective than traditional financial services. It is getting popular day by day. Customers use these solutions to source crypto, facilitate instant payments, empower their treasury, engage new audiences, lower capital requirements, and drive new revenue.

xrpl or XRP Ledger: A Scalable, Sustainable Blockchain.
The XRP Ledger (XRPL) is a decentralized, public blockchain led by a global developer community. It’s fast, energy efficient, and reliable. With ease of development, low transaction costs, and a knowledgeable community, it provides developers with a strong open-source foundation for executing on the most demanding projects—without hurting the environment.

You can perform all kinds of ripple operations with this xrpl library. In this project we have used xrpl javascript library. <br>
You can install xrpl using npm:
```
npm install xrpl
```

More details can be found https://xrpl.org/get-started-using-javascript.html

# Ripple Javascript Integration

This is a node js application for handling ripple transactions such as generate address, publish, transfer and estimate network fee<br/>
It has total four api's and it uses xrpl library to perform ripple operations.

# Running Application locally

```
# step 1 clone the repo
cd Ripple-Blockchain-Javascript-Integration
# step 2 configure the .env file
ln -s .env.dev .env
# step 3 install dependencies
npm install
# step 4 run the dev server
npm start
```

# Running Tests

```
# run test and build coverage report
npm test
```

# Building Docker image
```bash
./build_docker_image.sh
```

# Swagger UI URL
```
/ripple-integration/apidocs
```
