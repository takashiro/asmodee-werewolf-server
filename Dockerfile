FROM node:11.3.0
WORKDIR /usr/src/app
COPY . .
COPY package*.json ./
RUN npm install
CMD ["npm", "debug"]
