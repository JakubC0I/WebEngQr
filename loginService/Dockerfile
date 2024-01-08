FROM node

WORKDIR /app

COPY ./express-server.js ./express-server.js
COPY ./package.json ./package.json
COPY ./scripts ./scripts
COPY ./start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 4000

CMD ["./start.sh"]
