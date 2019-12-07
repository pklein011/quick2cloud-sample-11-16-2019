FROM node:10
WORKDIR /usr/src/app/qvsample
RUN npm install @cloudant/cloudant
RUN npm install cfenv
RUN npm install express
COPY . .
EXPOSE 8080
CMD ["node", "qvsample.js"]