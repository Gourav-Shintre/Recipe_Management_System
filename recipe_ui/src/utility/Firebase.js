import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBLVgTj6yb7vufbx0qKEKS2eYwDIpfTn6c",
  authDomain: "recipe-add21.firebaseapp.com",
  projectId: "recipe-add21",
  storageBucket: "recipe-add21.appspot.com",
  messagingSenderId: "252448492031",
  appId: "1:252448492031:web:d959b8edc0e0c24e527fca",
  measurementId: "G-EBBM06C5ZQ",
};

firebase.initializeApp(firebaseConfig);

export const dataref = firebase.database();
export const storage = firebase.storage();

export default firebase;
