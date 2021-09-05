<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Navbar</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link :to="{ name: 'Home' }" class="nav-link"
            >Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            v-show="$store.state.auth.userLoggedin"
            :to="{ name: 'Mutfak' }"
            class="nav-link"
            >Mutfak</router-link
          >
        </li>

        <li class="nav-item">
          <router-link
            v-show="$store.state.auth.userLoggedin"
            :to="{ name: 'Masalar' }"
            class="nav-link"
            >Masalar</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            v-show="$store.state.auth.userLoggedin"
            :to="{ name: 'Kasa' }"
            class="nav-link"
            >Kasa</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            v-show="$store.state.auth.userLoggedin"
            :to="{ name: 'Urunler' }"
            class="nav-link"
            >Ürünler</router-link
          >
        </li>
        <li class="nav-item">
          <router-link
            v-show="$store.state.auth.userLoggedin"
            :to="{ name: 'Siparis' }"
            class="nav-link"
            >Sipariş</router-link
          >
        </li>
        <li class="nav-item" v-if="!$store.state.auth.userLoggedin">
          <router-link class="nav-link" :to="{ name: 'Login' }"
            >Giriş Yap</router-link
          >
        </li>
        <li class="nav-item" v-if="!$store.state.auth.userLoggedin">
          <router-link class="nav-link" :to="{ name: 'Register' }"
            >Kayıt oL</router-link
          >
        </li>
        <li @click="logOut" class="nav-item" v-else>
          <a class="nav-link" style="cursor: pointer"> Çıkış yap </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
  methods: {
    logOut() {
      this.$store.dispatch("logOut");
      window.location.reload();
    },
  },
};
</script>
<style scoped>
.active {
  color: black !important;
}
</style>
