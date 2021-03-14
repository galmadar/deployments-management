# Deployments management API

The project is built with `yarn` as package-manager.

#### Run the project on a local machine - Development mode
1. Verify that you have `mongodb` running on your machine in port `27017`
2. Run `yarn install`
3. Run `yarn dev`

#### Run the project with `Docker` containers
Run the command `docker-compose up -d` in the root directory.<br>
Docker will create 2 containers for you: `node` and `mongo`<br>

#### Tests
in order to run the tests, just run `yarn test`

---
⚠️ PAY ATTENTION ⚠️<br>
- In "Development mode", the API will run on port `3000`<br>
- In Docker container, the API will run on port `8080` 
