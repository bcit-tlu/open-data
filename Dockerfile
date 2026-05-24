# Build stage
FROM node:24-alpine@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . /app
RUN npm run build


# Release/production
FROM nginxinc/nginx-unprivileged:alpine3.22-perl@sha256:f1444b4f78f91b0c42dedc01b55972f4d759e7fcbabdf5d5a5e2f0690234eef4

LABEL maintainer=courseproduction@bcit.ca
LABEL org.opencontainers.image.source="https://github.com/bcit-tlu/open-data"
LABEL org.opencontainers.image.description="Open Data Portal — a Docusaurus-based open data portal for learning analytics datasets."

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build/ ./
