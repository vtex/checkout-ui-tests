FROM cypress/base:14

ARG HORUS_PROXY_KEY
ENV HORUS_PROXY_KEY=$HORUS_PROXY_KEY

ARG HORUS_COGNITO_CREDENTIALS
ENV HORUS_COGNITO_CREDENTIALS=$HORUS_COGNITO_CREDENTIALS

RUN \
  apt-get update && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./ ./

RUN \
  yarn install && \
  yarn cypress verify
