# # Stage 1: Build the React app
# FROM node:18 as build

# WORKDIR /app

# COPY package.json /app/package.json
# COPY package-lock.json /app/package-lock.json

# RUN npm install

# COPY . /app

# RUN npm run build

# # Stage 2: Serve the React app with Nginx
# FROM nginx:1.23.1

# COPY --from=build /app/build /usr/share/nginx/html

# EXPOSE 80

# pull official base image
FROM node:lts-slim

# set work directory
WORKDIR /srv/app/

# add to $PATH
ENV PATH /srv/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./