<template>
  <div class="d-flex justify-content-center">
    <div class="col-md-6">
      <div
        v-if="show_alert"
        class="animate__animated animate__shakeX alert"
        :class="alert_variant"
        role="alert"
      >
        {{ alert_message }}
      </div>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="mail">E posta adresiniz</label>
          <input
            v-model="email"
            type="email"
            name="email"
            id="mail"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label for="password">Şifreniz</label>
          <input
            v-model="password"
            type="password"
            name="password"
            id="password"
            class="form-control"
            required
          />
        </div>
        <hr />
        <div class="form-group">
          <input
            type="submit"
            value="Kayıt ol"
            class="btn btn-success form-control"
            required
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      show_alert: false,
      alert_message: "Please wait signing...",
      alert_variant: "alert-primary",
    };
  },
  methods: {
    async register() {
      this.alert_message = "Please wait signing...";
      this.alert_variant = "alert-primary";
      this.show_alert = true;
      try {
        await this.$store.dispatch("register", {
          userMail: this.email,
          userPassword: this.password,
        });
      } catch (ex) {
        this.alert_message = "Opps something went wrgon..." + ex;
        this.alert_variant = "alert-danger";
        this.show_alert = true;
        return;
      }

      this.alert_message = "Success...";
      this.alert_variant = "alert-success";
      this.show_alert = true;
      window.location.reload();
    },
  },
};
</script>
