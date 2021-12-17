# todo-api

TODO Api is a project built using Node.js, Typescript and PostgreSQL.

## Installation Guide

Clone the project and run this commands in your terminal

```sh
git clone https://github.com/thiagocolebrusco/todo-api.git
cd todo-api
cp .env.example .env
docker-compose up
```

It requires Docker previously installed.
By default it runs on port `3030`, so access it through http://localhost:3030.

First you should login to be able the other routes. There is already an user with the following credentials.
```
{
   "email": "thiagocolebrusco@gmail.com",
   "password": "123123"
}
```

## Routes

| Route         | Description                                                                                            |
| ---------     | ------------------------------------------------------------------------------------------------------ |
| POST /users/login    | Login into application, generating a token to access all the other routes               |
| GET /users    | List of all users               |
| GET /users/:id    | Retrieve data for a specific user               |
| POST /users    | Create new user               |
| PUT /users/:id    | Update a user by id               |
| DELETE /users/:id    | Delete an user by id               |
| GET /tasks    | List of all tasks for the authenticated user               |
| GET /tasks/:id    | Retrieve a specific task by id - needs to below to the authenticated user |
| POST /tasks    | Create new task               |
| PUT /tasks/:id    | Update a task by id - needs to below to the authenticated user               |
| PUT /tasks/:id/status    | Update a task's status by id - needs to below to the authenticated user               |
| DELETE /tasks/:id    | Delete an user by id - needs to below to the authenticated user               |
