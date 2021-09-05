<template>
  <div class="row mt-5">
    <template v-for="desk in deskOrders" :key="desk.deskId">
      <div v-if="desk.orders.length > 0" class="col-md-4">
        <kasa-masa-item :desk="desk" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ordersCollection, auth } from "@/includes/firebase";
import KasaMasaItem from "@/components/Kasa/KasaMasaItem.vue";
export default {
  name: "Kasa",
  computed: {
    ...mapState({
      desks: (state) => state.desk.desks,
    }),
  },
  components: { KasaMasaItem },
  data() {
    return {
      deskOrders: [],
    };
  },

  async mounted() {
    this.desks.forEach((desk) => {
      this.deskOrders.push({
        deskId: desk.deskId,
        deskName: desk.deskName,
        orders: [],
      });
    });
    await ordersCollection
      .where("userId", "==", auth.currentUser.uid)
      .where("paid", "==", false)
      .onSnapshot((snapshot) => {
        this.deskOrders = [];
        this.desks.forEach((desk) => {
          this.deskOrders.push({
            deskId: desk.deskId,
            deskName: desk.deskName,
            orders: [],
            totalPrice: 0,
            unFilteredOrders: [],
          });
        });
        snapshot.forEach((doc) => {
          this.deskOrders.forEach((desk) => {
            if (desk.deskId == doc.data()["deskId"]) {
              let isHas = false;
              desk.unFilteredOrders.push({
                orderId: doc.id,
                ...doc.data(),
              });
              if (desk.orders.length == 0) {
                desk.totalPrice =
                  desk.totalPrice +
                  doc.data()["productCount"] * doc.data()["productPrice"];
                desk.orders.push({
                  orderId: doc.id,
                  ...doc.data(),
                });
                return;
              } else {
                desk.orders.forEach((order) => {
                  if (order.productId == doc.data()["productId"]) {
                    order.productCount =
                      order.productCount + doc.data()["productCount"];
                    desk.totalPrice =
                      desk.totalPrice +
                      doc.data()["productCount"] * doc.data()["productPrice"];
                    isHas = true;
                  }
                });
              }
              if (!isHas) {
                desk.orders.push({
                  orderId: doc.id,
                  ...doc.data(),
                });
                desk.totalPrice =
                  desk.totalPrice +
                  doc.data()["productCount"] * doc.data()["productPrice"];
              }
            } else {
              return;
            }
          });
        });
      });
  },
};
</script>
