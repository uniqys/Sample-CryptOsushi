# Sample-CryptOsushi

## Setup

### For development
```bash
$ export COMPOSE_FILE=docker-compose.dev.yml
$ docker-compose build
$ docker-compose run --rm uniqys-node yarn run init --unique "hello cryptosushi"
$ docker-compose up
```

open localhost:3000 for development.


### For production
```bash
$ export COMPOSE_FILE=docker-compose.prod.yml
$ docker-compose build
$ docker-compose run --rm uniqys-node yarn run init --unique "hello cryptosushi"
$ docker-compose up
```

open localhost:8080 for production.

## cleanup
```bash
$ docker-compose down -v
$ docker-compose run --rm uniqys-node yarn run init --unique "hello cryptosushi"
```