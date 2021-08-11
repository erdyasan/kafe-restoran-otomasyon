<template>
  <div class="card">
    <div
      @click.prevent="masaSiparisAl"
      class="card-header text-center"
      style="cursor: pointer"
    >
      <h2>
        {{ masa.deskName }}
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "SiparisMasalari",
  props: {
    masa: {
      type: Object,
      required: true,
    },
  },
  methods: {
    masaSiparisAl() {
      this.$router.push({
        name: "MasaSiparisAl",
        params: {
          id: this.masa.deskId,
        },
      });
    },
  },
};
</script>
