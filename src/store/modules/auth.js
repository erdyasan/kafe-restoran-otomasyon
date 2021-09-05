import { auth, usersCollection } from "@/includes/firebase";
export default {
  state: { userLoggedin: false, userInfo: {} },
  mutations: {
    login(state, payload) {
      state.userLoggedin = true;
      state.userInfo = payload;
    },
    toggle_auth(state) {
      state.userLoggedin = !state.userLoggedin;
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
        userMail: payload.userMail,
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
  },
};
