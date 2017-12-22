FROM node:9.3-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json .
RUN npm install -g nodemon --quiet
RUN npm install --quiet

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]