import { auth, productsCollection } from "@/includes/firebase";
export default {
  state: { products: [] },
  mutations: {
    init_products(state, payload) {
      state.products = payload;
    },
    addProduct(state, payload) {
      state.products.push(payload);
    },
    updateProduct(state, payload) {
      let index = state.products.findIndex(
        (X) => X.productId === payload.productId
      );
      state.products[index] = payload;
    },
    deleteProduct(state, id) {
      let index = state.products.findIndex((x) => x.productId == id);
      state.products.splice(index, 1);
    },
  },
  actions: {
    async init_products({ state, rootState, commit }) {
      if (state.products.length == 0 && rootState.auth.userLoggedin) {
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
      payload.productId = productId;
      commit("updateProduct", { ...payload });
    },
    async deleteProduct({ commit }, id) {
      await productsCollection.doc(id).delete();
      commit("deleteProduct", id);
    },
  },
  getters: {
    getProductsByCategoryId: (state) => (categoryId) => {
      return state.products.filter((x) => x.productCategory == categoryId);
    },
  },
};
