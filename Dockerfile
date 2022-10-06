FROM node:16-bullseye-slim as app

LABEL MAINTAINER https://github.com/HaitianLiu/RSSHubLite/

ENV NODE_ENV production
ENV TZ Asia/Shanghai

RUN ln -sf /bin/bash /bin/sh

RUN apt-get update && apt-get install -yq dumb-init python3 make g++ build-essential --no-install-recommends

WORKDIR /app

COPY package.json tools/clean-nm.sh /app/
COPY yarn.lock /app/

RUN yarn install --production --frozen-lockfile --network-timeout 1000000 && sh ./clean-nm.sh && yarn cache clean

COPY . /app

EXPOSE 1200
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start"]
