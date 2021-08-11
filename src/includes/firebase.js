import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const config = {
  apiKey: "AIzaSyCFsWlTVCeaDKesUcBcytPDLeBxUAQJAOU",
  authDomain: "realtimeapp-dfe42.firebaseapp.com",
  projectId: "realtimeapp-dfe42",
  storageBucket: "realtimeapp-dfe42.appspot.com",
  messagingSenderId: "867115103681",
  appId: "1:867115103681:web:4ac446aed96115132eab40",
};

firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();
const usersCollection = db.collection("users");
const desksCollection = db.collection("desks");
const productCategoriesCollection = db.collection("productCategories");
const productsCollection = db.collection("products");
const ordersCollection = db.collection("orders");
export {
  auth,
  usersCollection,
  desksCollection,
  productCategoriesCollection,
  productsCollection,
  ordersCollection,
};
