import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const config = {
  apiKey: "AIzaSyDAbIaSkzr1-yicnfpEzq7-hsGksmOkYyE",
  authDomain: "adisyon2-bbf56.firebaseapp.com",
  projectId: "adisyon2-bbf56",
  storageBucket: "adisyon2-bbf56.appspot.com",
  messagingSenderId: "202173956145",
  appId: "1:202173956145:web:9e0cadf80e960ee4ce9510"
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
