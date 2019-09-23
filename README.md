# CRM App

## Description

Simple side-project app to showcase a CRM website powered by VueJS, NodeJS, and PostgreSQL. It uses TypeScript, JWT, and GraphQL to properly communicate and hydrate data from the server.

## Screenshots

### Dashboard page

![Dashboard](/screenshots/dashboard.png?raw=true)

### Contacts page

![Contacts](/screenshots/contacts.png?raw=true)

### Projects page

![Projects](/screenshots/projects.png?raw=true)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build:prod
```

### Run the server in production mode

```
cross-env NODE_ENV=production npm run start
```

### Lints and fixes files

```
npm run lint
```

### Run unit tests

```
npm run test:unit
```

### Development Commands

PostgreSQL with Docker:

```
docker run --rm --name pg-docker \
-e POSTGRES_USER=dev_user \
-e POSTGRES_PASSWORD=dev_password \
-e POSTGRES_DB=dev_db \
-p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres:alpine
```

Create the tables needed for the database:

```
npm run migrate:latest
```

Seed the tables with sample data:

```
npm run seed:run
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
