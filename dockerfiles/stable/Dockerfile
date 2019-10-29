FROM cypress/base:12.12.0

ARG HORUS_PROXY_KEY
ENV HORUS_PROXY_KEY=$HORUS_PROXY_KEY

ARG HORUS_COGNITO_CREDENTIALS
ENV HORUS_COGNITO_CREDENTIALS=$HORUS_COGNITO_CREDENTIALS

RUN \
  apt-get update && \
  apt-get install -y ffmpeg && \
  yarn global add cypress && \
  rm -rf /var/lib/apt/lists/* && \
  ffmpeg -version && \
  cypress verify

WORKDIR /app

COPY ./ ./

RUN \
  yarn install && \
  yarn test:stable