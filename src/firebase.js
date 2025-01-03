// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ,
  authDomain: "humsta-6630a.firebaseapp.com",
  projectId: "humsta-6630a",
  storageBucket: "humsta-6630a.firebasestorage.app",
  messagingSenderId: "1043559054248",
  appId: "1:1043559054248:web:ac9458f2bdb115a847fb9d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// service firebase.storage {
//     match /b/{bucket}/o {
//       match /{allPaths=**} {
//         allow read;
//         allow write: if
//         request.resource.size < 2 * 1024 * 1024 && 
//         request.resource.contentType.matches('image/.*')
//       }
//     }
//   }