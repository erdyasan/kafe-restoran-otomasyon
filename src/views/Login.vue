<template>
  <div class="d-flex justify-content-center">
    <div class="col-md-6">
      <div v-if="show_alert" class="alert" :class="alert_variant">
        {{ alert_text }}
      </div>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="mail">E posta adresiniz</label>
          <input v-model="email" type="email" id="mail" class="form-control" />
        </div>
        <div class="form-group">
          <label for="password">Şifreniz</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control"
          />
        </div>
        <hr />
        <div class="form-group">
          <button type="submit" class="form-control btn btn-success">
            Giriş Yap
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      show_alert: false,
      alert_variant: "alert-primary",
      alert_text: "Please wait logging in",
    };
  },

  methods: {
    async login() {
      this.show_alert = true;
      this.alert_text = "Please wait logging in";
      this.alert_variant = "alert-primary";
      try {
        await this.$store.dispatch("login", {
          userMail: this.email,
          userPassword: this.password,
        });
      } catch (ex) {
        this.alert_text = "Opps something went wrong" + ex;
        this.alert_variant = "alert-danger";
        return;
      }

      this.alert_text = "Success!";
      this.alert_variant = "alert-success";
      window.location.reload();
    },
  },
};
</script>
