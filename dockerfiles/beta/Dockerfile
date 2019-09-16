FROM cypress/base:10

WORKDIR /app

COPY ./ ./

RUN \
  yarn install && \
  ENV=beta yarn test

ENTRYPOINT ["node", "./src/index.js"]