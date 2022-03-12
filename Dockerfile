FROM node:17-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . ./

CMD [ "npm", "run", "start" ]