FROM node
RUN mkdir -p /app
WORKDIR /app
RUN cp /package.json /app
RUN npm install
COPY . /usr/src/app
EXPOSE 8000
EXPOSE 3306
CMD ["npm", "start"]
