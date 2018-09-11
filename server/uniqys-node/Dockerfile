FROM node:10.9.0

ARG LEVELDOWN_DIR
ENV LEVELDOWN_DIR ${LEVELDOWN_DIR}
RUN mkdir -p ${LEVELDOWN_DIR}
VOLUME ${LEVELDOWN_DIR}

EXPOSE 8080
EXPOSE 56010
EXPOSE 56011

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn

COPY src /app/src
COPY tsconfig.json /app/tsconfig.json

RUN mkdir config

CMD yarn start
