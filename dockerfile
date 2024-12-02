FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY --chown=pptruser ./app/src /app/src
COPY --chown=pptruser ./app/package.json /app/package.json
COPY --chown=pptruser ./app/package-lock.json /app/package-lock.json
COPY --chown=pptruser ./app/tsconfig.json /app/tsconfig.json

RUN apt install psmisc
RUN npm install
RUN npm run build

HEALTHCHECK --interval=60s --timeout=5s --retries=10 CMD wget -O- --tries=1 http://localhost:12300/healthcheck/ || exit 1

ENTRYPOINT [ "node", "/app/dist/index.js"]
