# Express-mongoose-study

---

## About the project

This is a study project using the express and mongoose libraries, it aims to learn more about creating RESTFULL API's and about non-relational databases, it also serves to learn how to assemble a CI/CD pipeline using github Actions

### Stack

- Node.js v16.13.0
- Typescript v4.4.4
- MongoDB

## Configuration

### Requirements

- [Git](https://git-scm.com/downloads)
- [Node.js v16.13.0](https://nodejs.org/download/release/v16.13.0/)
- [Docker](https://www.docker.com/get-started)
- [MongoDB](https://www.mongodb.com/try/download/community) or use [docker-compose file](https://github.com/Poggioli/express-mongoose-study/blob/develop/docker-compose.yml)

### Resources available

Endpoints `/v1`:

#### Items

- GET `/items`
- GET `/items/:id`
- DELETE `items/:id`
- POST `/items`

#### Users

- POST `/users`
- GET `/users/email?email=`
- GET `/users/:id`
- DELETE `/users/:id`
- POST `/users/authenticate`

### Getting started

#### Run locally

```sh
1- npm install
2- docker-compose up mongoDB
3- npm run start:dev
```

#### Run tests

```sh
1- npm install
2- npm run test
```

The results can be seen in coverage/index.html

#### Run SonarQube quality gate

```sh
1- npm install
2- docker-compose up sonarqube
3- npm run sonar
```

The results can be seen in [localhost:9000](http://localhost:9000)
