FROM node:10.9.0

ARG DAPP_HOST
ENV DAPP_HOST ${DAPP_HOST}

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

