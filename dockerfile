FROM node:alpine3.22

WORKDIR /app

COPY package*.json /app

COPY . .

RUN chown -R 1000:1000 /app

USER 1000

EXPOSE 3333

RUN npm install

ENTRYPOINT ["sh", "-c", "npx sequelize db:migrate && node dist/server.js"]
