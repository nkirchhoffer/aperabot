FROM node:alpine3.14

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "app.js"]