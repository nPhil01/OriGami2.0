FROM monostream/nodejs-gulp-bower

# Setup build folder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/

#COPY package.json /usr/src/app/
#RUN npm install
#COPY bower.json .bowerrc* /usr/src/app/
#RUN bower install
#COPY . /usr/src/app/
#RUN grunt build

#VOLUME /usr/src/app/dist

COPY ./run.sh /

CMD ["./run.sh"]