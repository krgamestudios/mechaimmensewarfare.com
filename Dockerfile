FROM node:15.8
WORKDIR "/app"
COPY package*.json ./
RUN npm install
RUN apt-get update
COPY . /app
EXPOSE 3000
ENTRYPOINT ["bash", "-c"]
CMD ["npm start"]
