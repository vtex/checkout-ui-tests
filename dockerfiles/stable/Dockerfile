FROM cypress/base:10

ARG HORUS_PROXY_KEY
ENV HORUS_PROXY_KEY=$HORUS_PROXY_KEY

WORKDIR /app

COPY ./ ./

RUN \
  yarn install && \
  VTEX_ENV=stable yarn test

ENTRYPOINT ["node", "./src/index.js"]