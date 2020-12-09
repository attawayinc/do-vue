FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN apk add py-pip python-dev libffi-dev openssl-dev gcc libc-dev make
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
EXPOSE 37719
CMD ["node", "src/cli.js"]
