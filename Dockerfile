FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install wget -y
RUN apt-get install curl -y
RUN cd ~
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr
COPY package*.json ./
RUN npm install --save express
RUN npm install
# RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD npm start
