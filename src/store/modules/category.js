import { auth, productCategoriesCollection } from "@/includes/firebase";
export default {
  state: { categories: [] },
  mutations: {
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
  },
  actions: {
    async init_categories({ rootState, commit }) {
      if (!rootState.auth.userLoggedin) {
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
  },
};
