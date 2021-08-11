import { createStore } from "vuex";
import {
  auth,
  usersCollection,
  productCategoriesCollection,
  productsCollection,
  desksCollection,
} from "@/includes/firebase";
export default createStore({
  state: {
    userLoggedin: false,
    userInfo: {},
    desks: [],
    categories: [],
    products: [],
  },
  mutations: {
    login(state, payload) {
      state.userLoggedin = true;
      state.userInfo = payload;
    },
    toggle_auth(state) {
      state.userLoggedin = !state.userLoggedin;
    },
    init_categories(state, payload) {
      state.categories = payload;
    },
    addCategory(state, payload) {
      state.categories.push(payload);
    },
    deleteCategory(state, payload) {
      let index = state.categories.findIndex((x) => x.categoryId === payload);
      state.categories.splice(index, 1);
    },
    updateCategory(state, payload) {
      let index = state.categories.findIndex(
        (x) => x.categoryId === payload.id
      );
      state.categories[index].categoryName = payload.categoryName;
    },

    init_products(state, payload) {
      state.products = payload;
    },
    addProduct(state, payload) {
      state.products.push(payload);
    },
    updateProduct(state, payload) {
      let index = state.products.indexOf(
        (X) => X.productId == payload.productId
      );
      delete payload.productId;
      state.products[index] = { ...payload };
    },
    deleteProduct(state, id) {
      let index = state.products.indexOf((x) => x.productId == id);
      state.products.splice(index, 1);
    },

    init_desks(state, payload) {
      state.desks = payload;
    },
    addDesk(state, payload) {
      state.desks.push(payload);
    },
    deleteDesk(state, payload) {
      let index = state.desks.findIndex((x) => x.deskId == payload);
      state.desks.splice(index, 1);
    },
    updateDesk(state, payload) {
      let index = state.desks.findIndex((x) => x.deskId == payload.deskId);
      delete payload.deskId;
      state.desks[index].deskName = payload.deskName;
    },
  },
  actions: {
    init_login({ commit }) {
      const user = auth.currentUser;
      if (user) {
        commit("toggle_auth");
      }
    },
    async register({ commit }, payload) {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        payload.userMail,
        payload.userPassword
      );
      usersCollection.doc(userCredentials.user.uid).set({
        userMail: this.email,
      });
      commit("toggle_auth");
    },
    async login({ commit }, payload) {
      console.log(payload);
      await auth.signInWithEmailAndPassword(
        payload.userMail,
        payload.userPassword
      );
      commit("toggle_auth");
    },
    async logOut({ commit }) {
      await auth.signOut();
      commit("toggle_auth");
    },
    async init_categories({ state, commit }) {
      if (!state.userLoggedin) {
        return;
      }
      const categories = await productCategoriesCollection
        .where("userId", "==", auth.currentUser.uid)
        .get();
      let cats = [];
      categories.forEach((doc) => {
        cats.push({
          categoryId: doc.id,
          categoryName: doc.data()["categoryName"],
          categoryCreateTime: doc.data()["categoryCreateTime"],
        });
      });
      commit("init_categories", cats);
    },
    async addCategory({ commit }, payload) {
      const cat = await productCategoriesCollection.add({
        userId: auth.currentUser.uid,
        categoryName: payload.kategoriAdi,
        categoryCreateTime: payload.tarih,
      });
      commit("addCategory", {
        categoryName: payload.kategoriAdi,
        categoryCreateTime: payload.tarih,
        userId: auth.currentUser.uid,
        categoryId: cat.id,
      });
    },
    async deleteCategory({ commit }, payload) {
      await productCategoriesCollection.doc(payload.id).delete();
      commit("deleteCategory", payload.id);
    },
    async updateCategory({ commit }, payload) {
      let id = payload.id;
      delete payload.id;
      delete payload.index;
      await productCategoriesCollection.doc(id).update(payload);
      commit("updateCategory", {
        id: id,
        ...payload,
      });
    },

    async init_products({ state, commit }) {
      if (state.products.length == 0 && state.userLoggedin) {
        console.log("products initialized");
        const productsSnapshot = await productsCollection
          .where("userId", "==", auth.currentUser.uid)
          .get();

        let products = [];
        productsSnapshot.forEach((doc) => {
          products.push({
            productId: doc.id,
            productName: doc.data()["productName"],
            productCategory: doc.data()["productCategory"],
            productPrice: doc.data()["productPrice"],
            userId: doc.data()["userId"],
            productAddDate: doc.data()["productAddDate"],
          });
        });
        commit("init_products", products);
      }
    },

    async addProduct({ commit }, payload) {
      const doc = await productsCollection.add({
        productName: payload.urunAdi,
        productCategory: payload.kategori,
        productPrice: payload.urunFiyat,
        productAddDate: payload.tarih,
        userId: auth.currentUser.uid,
      });
      commit("addProduct", {
        productId: doc.id,
        productName: payload.urunAdi,
        productCategory: payload.kategori,
        productPrice: payload.urunFiyat,
        productAddDate: payload.tarih,
        userId: auth.currentUser.uid,
      });
    },
    async updateProduct({ commit }, payload) {
      const productId = payload.productId;
      delete payload.productId;
      await productsCollection.doc(productId).update({
        ...payload,
      });
      commit("updateProduct", { productId: productId, ...payload });
    },
    async deleteProduct({ commit }, id) {
      await productsCollection.doc(id).delete();
      commit("deleteProduct", id);
    },
    async init_desks({ commit }) {
      let desks = [];
      const deskSnapshot = await desksCollection.get();
      deskSnapshot.forEach((doc) => {
        desks.push({ deskId: doc.id, ...doc.data() });
      });
      commit("init_desks", desks);
    },
    async addDesk({ commit }, payload) {
      const deskDoc = await desksCollection.add({
        deskName: payload.deskName,
        userId: auth.currentUser.uid,
        deskCreateTime: payload.deskCreateTime,
      });
      commit("addDesk", {
        deskId: deskDoc.id,
        deskName: payload.deskName,
        deskCreateTime: payload.deskCreateTime,
        userId: auth.currentUser.uid,
      });
    },
    async deleteDesk({ commit }, deskId) {
      await desksCollection.doc(deskId).delete();
      commit("deleteDesk", deskId);
    },
    async updateDesk({ commit }, payload) {
      let deskId = payload.deskId;
      delete payload.deskId;
      desksCollection.doc(deskId).update({
        deskName: payload.deskName,
      });
      commit("updateDesk", {
        deskId: deskId,
        ...payload,
      });
    },
  },
  getters: {
    getProductsByCategoryId: (state) => (categoryId) => {
      return state.products.filter((x) => x.productCategory == categoryId);
    },
  },
  modules: {},
});
