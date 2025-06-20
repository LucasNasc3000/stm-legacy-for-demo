FROM node:alpine3.22

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

RUN chown -R 1000:1000 /app

USER 1000

EXPOSE 3333

ENTRYPOINT ["sh", "-c", "npx sequelize db:migrate && node dist/server.js"]
