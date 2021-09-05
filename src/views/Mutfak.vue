<template>
  <h2>
    Mutfağa hoş geldiniz hazırlanmayan siparişler aşağıda listelenmektedir.!
  </h2>
  <div class="row">
    <template v-for="desk in deskOrders" :key="desk.deskId">
      <div v-if="desk.orders.length > 0" class="col-md-3">
        <mutfak-masa-item :desk="desk" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ordersCollection, auth } from "@/includes/firebase";
import MutfakMasaItem from "@/components/Mutfak/MutfakMasaItem.vue";
export default {
  name: "Mutfak",
  data() {
    return {
      siparisler: [],
      deskOrders: [],
    };
  },
  components: {
    MutfakMasaItem,
  },
  computed: {
    ...mapState({
      desks: (state) => state.desk.desks,
    }),
  },
  async created() {
    this.desks.forEach((desk) => {
      this.deskOrders.push({
        deskId: desk.deskId,
        deskName: desk.deskName,
        orders: [],
      });
    });
    const desksAndOrders = await ordersCollection
      .where("userId", "==", auth.currentUser.uid)
      .where("orderReady", "==", false)
      .get();

    desksAndOrders.forEach((orderDoc) => {
      this.deskOrders.forEach((desk) => {
        if (desk.deskId == orderDoc.deskId) {
          desk.orders.push({
            orderId: orderDoc.id,
            ...orderDoc.data(),
          });
        }
      });
    });
    await ordersCollection
      .where("userId", "==", auth.currentUser.uid)
      .where("orderReady", "==", false)
      .where("paid", "==", false)
      .onSnapshot((snapshot) => {
        this.deskOrders = [];
        this.desks.forEach((x) => {
          this.deskOrders.push({
            deskId: x.deskId,
            deskName: x.deskName,
            orders: [],
          });
        });
        let siparisler = [];
        snapshot.forEach((doc) => {
          this.deskOrders.forEach((desk) => {
            if (desk.deskId === doc.data()["deskId"]) {
              desk.orders.push({
                orderId: doc.id,
                ...doc.data(),
              });
            }
          });
          this.siparisler = siparisler;
        });
      });
  },
};
</script>
