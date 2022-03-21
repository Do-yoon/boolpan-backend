FROM node:16
ENV NODE_ENV=production

WORKDIR /usr
COPY package*.json ./
RUN npm install
RUN npm install --save express
# RUN npm ci --only=production
COPY . .
EXPOSE 8081
CMD npm start
