ARG NODE_VERSION=lts

FROM node:${NODE_VERSION}-alpine AS frontendbuilder

WORKDIR /app

COPY ./frontend .

RUN npm install -g @angular/cli
RUN npm install
RUN ng build --configuration production --base-href /frontend/

FROM node:${NODE_VERSION}-alpine AS main

WORKDIR /app

COPY ./backend .

RUN npm install

COPY --from=frontendbuilder /app/dist/* ./static

ENTRYPOINT [ "node", "index.js" ]