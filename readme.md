<h1 align="center">
 📽 Video call app
</h1>
<p align="center">🚀 Proof of concept for a video call micro-service using WebRTC, WebSockets and React.</p>
  
## Description

The objective of this project was to test the performance and propose some architectures to create the base of a videoCall service.

## Preview

<img src="webrtcpreview.gif" data-canonical-src="webrtcpreview.gif" width="500" />

## Installing and running the application
```bash
# First clone the repository
$ git clone https://github.com/luamfmenezes/study-webrtc
```

## Back-end
### 🎲 Runing the backend (Server).

```bash

# go to server folder:
$ cd server

# install the dependencies:
$ yarn
# or 
$ npm install

# Run the application in development mode:
$ yarn dev
# or
$ npm run dev

# The server will run on Port: 3333 - access http://localhost:3333
```

## Front-end
### 🎲 Runing the frontend (Web).

```bash

# go to web folder:
$ cd web

# install the dependencies:
$ yarn
# or 
$ npm install

# Run the application:
$ yarn start
# or
$ npm start

# The app will run on Port: 3000 - access http://localhost:3000 usign a browser.
```

## Mobile
### 🛠 Config Mobile App.

```bash

# go to config folder
$ cd mobile/webrtc/src/config

# 1. Configure the file env-example.ts
# 2. Rename the file to env.ts

```

### 🛠 Setup libraries (guides)

#### react-native-webrtc
 https://github.com/react-native-webrtc/react-native-webrtc
 
 #### react-native-onesignal
 https://www.npmjs.com/package/react-native-onesignal
 

### 🎲 Running Mobile App.

```bash

# go to mobile/webrtc folder:
$ cd mobile/webrtc

# Install app and run the application on Android:
$ npx react-native run-android

# Install app and run the application on IOS:
$ npx react-native run-ios

# Only run application:
$ yarn start

```

