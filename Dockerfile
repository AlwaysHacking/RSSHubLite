FROM node:14-slim

LABEL MAINTAINER https://github.com/HaitianLiu/RSSHubLite/

ENV NODE_ENV production
ENV TZ Asia/Shanghai

RUN ln -sf /bin/bash /bin/sh

RUN apt-get update && apt-get install -yq openssh-client libgconf-2-4 apt-transport-https git dumb-init python make g++ build-essential --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json tools/clean-nm.sh /app/

RUN npm install --production && sh ./clean-nm.sh

COPY . /app

EXPOSE 1200
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start"]
