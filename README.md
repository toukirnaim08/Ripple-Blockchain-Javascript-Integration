# Unido Core - Ripple Tx service
Unido Ripple Tx service.<br />
This is a service for handleing ripple opperations for unido<br />
The server is hosted on localhost 5130

## Steps to run before pushing to GIT
```bash
# Run the tests before pushing to git
npm run bbrun
# this command runs test on ripple_service and the mocked internal_server

```
## Steps to run external and internal tests
```bash
# The external test hits the testnet using their webhook. 

# External tests are disabled by default to change this go open external test, line 23,
# and remove the .skip
# this will enable the external tests. 

npm run bbrun
# this command will now run both the external and internal tests


```


---
#### Build & Push:
```bash
./run_docker_prod.sh
```

---
### Dev Env:
```bash
# step 1 clone the repo
git clone git@bitbucket.org:worldwebgroup/unido-ripple-tx-service.git
cd unido-ripple-tx-service

# step 2 configure the .env file
ln -f -s .env.prod .env

# step 3 install dependencies
npm install

# step 4 run the dev server
npm start

```

---
## Swagger UI URL
```
/unido-ripple-tx-service/pages/apidocs
```