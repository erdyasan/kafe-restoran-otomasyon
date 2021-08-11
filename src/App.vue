<template>
  <app-header />
  <div class="container">
    <router-view />
  </div>
</template>
<script>
import AppHeader from "@/components/Header.vue";
export default {
  name: "App",
  components: {
    AppHeader,
  },
  created() {
    this.$store.dispatch("init_login");
    this.$store.dispatch("init_categories");
    this.$store.dispatch("init_products");
    this.$store.dispatch("init_desks");
  },
};
</script>
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
