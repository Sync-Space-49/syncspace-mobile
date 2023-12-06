FROM node:20.1-alpine
WORKDIR /app
COPY / /app/
RUN npm install
RUN npm uninstall -g @ionic/cli
RUN npm install -g @ionic/cli@latest
CMD [ "ionic", "serve", "--no-livereload", "--host", "0.0.0.0" ]