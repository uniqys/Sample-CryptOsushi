FROM node:10.9.0

ARG LEVELDOWN_DIR
ENV LEVELDOWN_DIR ${LEVELDOWN_DIR}
VOLUME ${LEVELDOWN_DIR}

EXPOSE 8080
EXPOSE 56010
EXPOSE 56011

WORKDIR /app

# dependencies
COPY ./package.json /app/package.json
COPY ./yarn.lock    /app/yarn.lock
RUN yarn

# src
COPY ./src           /app/src
COPY ./tsconfig.json /app/tsconfig.json

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["yarn", "start"]

