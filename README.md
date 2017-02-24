### Getting to work offline with express
* start mongodb
```sh
mongod --bind_ip 0.0.0.0
```
* or
```sh
mongod --dbpath .../data
```
* use db
```sh
mongo
```
```sh
use dbname
```
* start server
* go to /server
```sh
npm install
```
```sh
node server.js
```
* server will start on localhost:5000
* you can't get games/metadata - there will be error shown -- so don't mind ;)

### different way offline with gulp
* Follow the instructions
```sh
npm install -g gulp
```
```sh
npm install -g ionic
```
* goto directory of OriGami2.0
```sh
npm install
```
* after npm install type in following command to start server. It will start at localhost:8000
```sh
gulp dev
```

# OriGami
OriGami is the geospatial learning game for kids. Consist of two parts:
* For teachers, which are able to create and edit new games
* For students/kids, which don't have an access to game creation mode. Only able to play already created games.

### Technologies
* Ionic Framework + Leaflet + Angular Material - Frontend
* Nodejs + Mongodb - Backend

### Basic Terminology
* Game -  Basic unit of play. Consists of 1:N navigation activities
* Navigation Activity - An activity that involves (geo)spatial components requiring use of maps and requires locomotion of the player. Can consist of 0:N tasks
* Task - Involves a spatial competency requiring particpant's action at a given location. The locations are predefined.

### Build Instructions

Prerequisites: Nodejs

Install the [Ionic framework](http://ionicframework.com/getting-started/) and clone this repository locally. In your project directory, use the following commands to build a package for your platform.
#### for Android
* Add the following cordova plugins
```sh  
ionic plugin add cordova-plugin-whitelist
ionic plugin add org.apache.cordova.geolocation
```
* Add platform
```sh
ionic platform add android
```
* Build
```sh
ionic build android
```
If successful, the APK will be created under
*\<project-dir\>/platforms/android/build/outputs/apk/android-debug.apk*
* Run (requires Android SDK)
```sh
ionic run android
```
  This will copy the APK to the connected device and launch it. The device must be configured to allow debugging.

### REST API

* http://server-name : port/games - get all available games (GET)
* http://server-name : port/games/item/*game_name* - get only one game (GET)
* http://server-name : port/games/item - add a new game (POST)
* http://server-name : port/games/item/*game_name* - delete one game (DELETE)

### Version
2.0.0

### Attributions
Map Marker Icons by Johan H. W. Basberg from the Noun Project (Creative Commons)

License
----

MIT
