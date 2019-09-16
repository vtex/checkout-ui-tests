FROM cypress/base:10

WORKDIR /app

COPY ./ ./

RUN \
  yarn install && \
  VTEX_ENV=beta yarn test

ENTRYPOINT ["node", "./src/index.js"]