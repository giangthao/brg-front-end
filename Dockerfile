FROM node:11-alpine

WORKDIR app/

COPY . .

RUN npm i @angular/cli@11.2.7

RUN npm install

RUN npm run build

EXPOSE 4302

CMD ["npm", "run", "start"]