FROM node:8
WORKDIR /usr/src/realtimewebclient
COPY . .
RUN yarn install && yarn cache clean
RUN npm run build
CMD npm start
