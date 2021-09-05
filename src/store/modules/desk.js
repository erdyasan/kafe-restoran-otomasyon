import { auth, desksCollection } from "@/includes/firebase";
export default {
  state: { desks: [] },
  mutations: {
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
    async init_desks({ commit }) {
      let desks = [];
      const deskSnapshot = await desksCollection
        .where("userId", "==", auth.currentUser.uid)
        .get();
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
};
