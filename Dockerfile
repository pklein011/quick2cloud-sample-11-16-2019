FROM node:10
WORKDIR /usr/src/app/qvsample
COPY package*.json ./
RUN npm install @cloudant/cloudant
RUN npm install cfenv
RUN npm install express
COPY . .
EXPOSE 8081
CMD ["node", "qvsample.js"]