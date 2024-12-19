# builder image
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci ; npm cache clean --force

COPY . .

RUN npm run build

# base image
FROM nginx:alpine

# copy the build files to nginx public directory
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

# run nginx to run in the foreground to prevent the container from immediately terminating
ENTRYPOINT ["nginx", "-g", "daemon off;"]