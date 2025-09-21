FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
