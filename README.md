# Ripple Javascript Integration

This is a node js application for handling ripple transactions such as generate address, pulish, transfer and estimate network fee<br/>
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
