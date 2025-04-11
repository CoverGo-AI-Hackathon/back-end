# stage 1
FROM node:22.14-bullseye AS build
WORKDIR /app
COPY . .
RUN npm install

CMD [ "npm", "run", "start" ]