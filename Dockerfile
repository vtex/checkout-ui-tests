FROM cypress/base:10

WORKDIR /app

# RUN \
#   apt-get update && \
#   apt-get install -y ffmpeg && \
#   yarn global add cypress && \
#   rm -rf /var/lib/apt/lists/*

# RUN \
#   ffmpeg -version && \
#   cypress verify

COPY ./ ./

RUN chmod +x ./run.sh && \
    yarn install

ENTRYPOINT ["/bin/bash", "-c", "./run.sh"]
# ENTRYPOINT ["node", "./src/index.js"]
