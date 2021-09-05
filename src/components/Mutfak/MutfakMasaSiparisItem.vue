<template>
  <h5>{{ order.productCount }} adet {{ order.productName }}</h5>
  <button @click.prevent="siparisHazir" class="btn btn-success">
    {{ order.productName }} hazır
  </button>
</template>

<script>
import { ordersCollection } from "@/includes/firebase";
export default {
  name: "MutfakMasaSiparisItem",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async siparisHazir() {
      try {
        await ordersCollection
          .doc(this.order.orderId)
          .update({ orderReady: true });
      } catch (ex) {
        console.log(ex);
      }
    },
  },
};
</script>
