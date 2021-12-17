FROM node:14
EXPOSE 3030

WORKDIR /home/app

COPY package.json /home/app/
COPY yarn.lock /home/app/

COPY . /home/app

RUN yarn 

RUN chmod 755 /home/app

CMD yarn dev