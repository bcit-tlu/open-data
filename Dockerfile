## Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . /app
RUN npm run build


## Release/production
FROM nginxinc/nginx-unprivileged:alpine3.22-perl

LABEL maintainer=courseproduction@bcit.ca
LABEL org.opencontainers.image.source="https://github.com/bcit-tlu/open-data"
LABEL org.opencontainers.image.description="Open Data Portal — a Docusaurus-based open data portal for learning analytics datasets."

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build/ ./
