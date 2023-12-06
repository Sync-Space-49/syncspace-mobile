FROM node:20.1-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install react@latest react-dom@latest
RUN npm install @ionic/react@7 @ionic/react-router@7
RUN npm install @ionic/cli
RUN npm install
CMD [ "ionic", "serve" ]