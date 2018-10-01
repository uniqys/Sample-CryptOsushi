FROM node:10.9.0

ARG UNIQYS_NODE_HOST
ENV UNIQYS_NODE_HOST ${UNIQYS_NODE_HOST}

ARG UNIQYS_NODE_PORT
ENV UNIQYS_NODE_PORT ${UNIQYS_NODE_PORT}

ARG DAPP_ENDPOINT
ENV DAPP_ENDPOINT ${DAPP_ENDPOINT}

EXPOSE 3000

WORKDIR /app

# dependencies
COPY ./package.json /app/package.json
COPY ./yarn.lock    /app/yarn.lock
RUN yarn

# src
COPY ./.eslintrc.js   /app/.eslintrc.js
COPY ./assets         /app/assets
COPY ./components     /app/components
COPY ./layouts        /app/layouts
COPY ./nuxt.config.js /app/nuxt.config.js
COPY ./pages          /app/pages
COPY ./plugins        /app/plugins
COPY ./static         /app/static
COPY ./store          /app/store
RUN NODE_ENV=production yarn build

# for dev
CMD ["yarn", "dev"]

