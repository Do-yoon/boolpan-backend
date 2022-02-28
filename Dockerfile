FROM node:16

WORKDIR /usr
COPY package*.json ./
RUN npm install
RUN npm install --save express
# RUN npm ci --only=production
COPY . .
EXPOSE 8081
CMD npm start

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
