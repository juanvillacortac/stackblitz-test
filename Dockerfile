FROM node:14.15.4 as build

ARG BUILD_COMMAND=build:prod

WORKDIR /app

COPY WebApps/InnovaCloud/ClientApp/package.json /app/
COPY WebApps/InnovaCloud/ClientApp/package-lock.json /app/
RUN npm install

COPY WebApps/InnovaCloud/ClientApp/ /app/
RUN npm run ${BUILD_COMMAND}

FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html
COPY WebApps/InnovaCloud/ClientApp/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]