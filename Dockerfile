FROM node:24.15.0-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p tmp uploads

EXPOSE 3333

RUN npm run build

WORKDIR /app/build

RUN npm ci --omit="dev"

CMD ["node", "bin/server.js"]
