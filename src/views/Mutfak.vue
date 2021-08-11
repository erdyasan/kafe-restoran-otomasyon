<template>
  <h2>Welcome</h2>
  <ul>
    <li v-for="siparis in siparisler" :key="siparis.orderId">
      {{ siparis.productName }}
    </li>
  </ul>
</template>

<script>
import { ordersCollection } from "@/includes/firebase";
export default {
  name: "Mutfak",
  data() {
    return {
      siparisler: [],
    };
  },
  computed: {},
  mounted() {
    ordersCollection.onSnapshot((snapshot) => {
      let siparisler = [];
      snapshot.forEach((doc) => {
        console.log(doc.data()["productAddDate"].toDate());

        siparisler.push({
          orderId: doc.id,
          ...doc.data(),
        });

        this.siparisler = siparisler;
      });
    });
  },
};
</script>
