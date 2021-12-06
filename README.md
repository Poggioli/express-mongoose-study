# Express-mongoose-study

---

![Build](https://github.com/Poggioli/express-mongoose-study/actions/workflows/build.yml/badge.svg)
![Lint](https://github.com/Poggioli/express-mongoose-study/actions/workflows/lint.yml/badge.svg)
![Test](https://github.com/Poggioli/express-mongoose-study/actions/workflows/test.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/Poggioli/express-mongoose-study/badge.svg?branch=main)](https://coveralls.io/github/Poggioli/express-mongoose-study?branch=main)

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
- [MongoDB](https://www.mongodb.com/try/download/community) or use [docker-compose file](https://github.com/Poggioli/express-mongoose-study/blob/main/docker-compose.yml)

### Resources available

Endpoints `/v1`:

#### Items

- GET `/items`
- GET `/items/:id`
- POST `/items`
- PUT `/items/:id`
- DELETE `items/:id`

#### Users

- GET `/users/:id`
- POST `/users`
- POST `/users/authenticate`
- DELETE `/users/:id`

#### Roles

- GET `/roles`
- GET `/roles/:id`
- POST `/roles`
- PUT `/roles/:id`
- DELETE `/roles/:id`

#### GroupItems

- GET `/groupItems`
- GET `/groupItems/:id`
- POST `/groupItems`
- PUT `/groupItems/:id`
- DELETE `/groupItems/:id`

### Docker image

To create a docker image of this app just run the follow command

```sh
docker build . -t express-mongoose-study &&
docker run -p 3002:3002 express-mongoose-study
```

The application will respond on port 3002, to test if it went up correctly, just access [health endpoint](http://localhost:3002/health)

### Getting started

#### Run locally

```sh
npm install &&
docker-compose up mongoDB &&
npm run start:dev
```

#### Run tests

```sh
npm install &&
npm run test
```

The results can be seen in coverage/index.html

#### Run SonarQube quality gate

```sh
npm install &&
docker-compose up sonarqube &&
npm run sonar
```

The results can be seen in [localhost:9000](http://localhost:9000)
