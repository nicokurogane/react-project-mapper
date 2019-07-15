This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Mapper

This is a Toy Project using Google Maps + React. based on an old idea for mapping real-state projects for FUNDASAL.

### Setup

you need to create the following files: 

1. A js file called MapConfig.js, it must be placed inside src/components/MapConfig.js. the  file must containg the following:
    const mapKey = "YOUR_GOOGLE_MAPS_WEB_API_KEY";
    export default mapKey;
    
2. a firebase config file with valid credentials. Create a folder in src called "firebase" and inside it, create a file and name it 
   "firebaseconfig.js". the file must have the following:
   
   import * as firebase from 'firebase';
   var config = { //YOUR_FIREBASE_CREDENTIAL HERE 
   };

   // Initialize Firebase
   firebase.initializeApp(config);
   var firestoreDb = firebase.firestore();
   //Initialize Firestore

   export default firestoreDb;

3. when you're done setting-up those files, then  you can run npm start or yarn start in the project directory.

## Credits to Cuneyt!!
You can read [this tutorial](https://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/)
if you want more details on how to set up Google Maps without a library or dependency. 
 His [Blog](https://cuneyt.aliustaoglu.biz/en/) 