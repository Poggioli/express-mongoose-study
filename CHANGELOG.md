# Changelog

## [2021-11-30] version 1.0.0

## Added

- express app
- tests
- dockerfile and docker-compose
- github actions CI

## [] version 2.0.0

## Added

- badges for build, test and lint status
- change configs
- create JWT validator
- JWT validator to:
  - POST /items
  - PUT /items/:id
  - DELETE /items/:id
- create new errors
- roles endpoint
  - POST /roles
  - PUT /roles/:id
  - GET /roles/:id
  - GET /roles
  - DELETE /roles/:id
- added new property to User model, user needs the role to create new user
- only the same user can update an user

## Removed

- endpoint GET - /users/email
