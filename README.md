# crm

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
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Run your unit tests

```
npm run test:unit
```

### Development Commands

PostgreSQL:

```
docker run --rm --name pg-docker \
-e POSTGRES_USER=dev_user \
-e POSTGRES_PASSWORD=dev_password \
-e POSTGRES_DB=dev_db \
-p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres:alpine
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
