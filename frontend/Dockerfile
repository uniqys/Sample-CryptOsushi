FROM node:10.9

ARG DAPP_HOST
ENV DAPP_HOST ${DAPP_HOST}
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock    /app/yarn.lock

RUN yarn

COPY ./ /app

RUN NODE_ENV=production yarn build

EXPOSE 3000

# for dev
CMD yarn dev
