FROM node:18-alpine

# Create app directory
WORKDIR /opt/asmodee-werewolf

# Install app
COPY dist .
COPY conf/config.json ./
COPY package*.json ./
RUN npm ci --production && rm package*.json

# Expose app
EXPOSE 8080
CMD [ "node", "cli.js" ]
