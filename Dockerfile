FROM node:22.11.0-alpine3.20

RUN mkdir /app
WORKDIR /app

COPY src/server.js server.js
COPY src/index.js index.js
COPY src/package.json package.json
RUN chown nobody:nobody .

USER nobody:nobody

CMD ["npm", "run", "dev"]
