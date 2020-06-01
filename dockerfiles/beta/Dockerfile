FROM cypress/base:10

ARG HORUS_PROXY_KEY
ENV HORUS_PROXY_KEY=$HORUS_PROXY_KEY

ARG HORUS_COGNITO_CREDENTIALS
ENV HORUS_COGNITO_CREDENTIALS=$HORUS_COGNITO_CREDENTIALS

RUN \
  apt-get update && \
  yarn global add cypress && \
  rm -rf /var/lib/apt/lists/* && \
  cypress verify

WORKDIR /app

COPY ./ ./

RUN \
  yarn install
