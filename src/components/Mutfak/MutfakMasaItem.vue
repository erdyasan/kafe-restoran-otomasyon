<template>
  <div class="card">
    <div class="alert" :class="alert_variant" v-if="show_alert">
      {{ alert_text }}
    </div>
    <div class="card-header text-center">
      <h2>{{ desk.deskName }}</h2>
    </div>
    <div class="card-body">
      <mutfak-masa-siparis-item
        v-for="order in desk.orders"
        :key="order.orderId"
        :order="order"
      />
    </div>
    <div class="card-footer">
      <button @click.prevent="ordersReady" class="btn btn-success">
        Tüm siparişler hazır
      </button>
    </div>
  </div>
</template>

<script>
import MutfakMasaSiparisItem from "@/components/Mutfak/MutfakMasaSiparisItem.vue";
import { ordersCollection } from "@/includes/firebase";
export default {
  name: "MutfakMasaItem",
  components: {
    MutfakMasaSiparisItem,
  },
  props: {
    desk: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      alert_variant: "alert-primary",
      show_alert: false,
      alert_text: "Lütfen bekleyiniz...",
    };
  },
  methods: {
    async ordersReady() {
      this.show_alert = true;
      this.alert_text = "Lütfen bekleyiniz";
      this.alert_variant = "alert-primary";
      try {
        this.desk.orders.forEach(async (order) => {
          ordersCollection.doc(order.orderId).update({
            orderReady: true,
          });
        });
      } catch (ex) {
        this.alert_text = "İşlem sırasında hata oluştu!" + ex;
        this.alert_variant = "alert-danger";
        setTimeout(() => {
          this.show_alert = false;
        }, 3000);
        return;
      }

      this.alert_text = "İşlem Başarılı!";
      this.alert_variant = "alert-success";
      setTimeout(() => {
        this.show_alert = false;
      }, 3000);
    },
  },
};
</script>
