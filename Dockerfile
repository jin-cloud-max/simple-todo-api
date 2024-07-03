# Check out https://hub.docker.com/_/node to select a new base image
FROM node:20-slim

RUN apt-get update -y \
    && apt-get install -y openssl \
    && apt-get install -y curl \
    && apt-get install -y net-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 \
    SERVER_PORT=3333

RUN chmod +x ./scripts/start_server.sh

EXPOSE ${SERVER_PORT}

# CMD [ "node", "." ]