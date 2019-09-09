FROM cypress/base:10

WORKDIR /app

COPY ./ ./

RUN \
  yarn install && \
  yarn test

ENTRYPOINT ["node", "./src/index.js"]