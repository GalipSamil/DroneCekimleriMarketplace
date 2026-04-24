FROM node:24-alpine AS build
WORKDIR /app

ARG VITE_API_URL=
ARG VITE_ENABLE_PASSWORD_RESET=true
ARG VITE_GA_MEASUREMENT_ID=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENABLE_PASSWORD_RESET=$VITE_ENABLE_PASSWORD_RESET
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build -- --mode docker

FROM nginx:1.27-alpine AS final
WORKDIR /usr/share/nginx/html

COPY frontend/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./

EXPOSE 80
