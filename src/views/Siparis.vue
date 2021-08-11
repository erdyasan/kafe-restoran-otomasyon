<template>
  <div class="row mt-5">
    <div class="col-md-3 mt-3" v-for="masa in masalar" :key="masa.deskId">
      <siparis-masalari :masa="masa" />
    </div>
  </div>
</template>

<script>
import SiparisMasalari from "@/components/Siparis/SiparisMasalari.vue";
import { desksCollection, auth } from "@/includes/firebase";
export default {
  name: "Siparis",
  components: {
    SiparisMasalari,
  },
  data() {
    return {
      masalar: [],
    };
  },
  async created() {
    const desksSnapsot = await desksCollection
      .where("userId", "==", auth.currentUser.uid)
      .get();
    desksSnapsot.forEach((doc) => {
      this.masalar.push({
        deskId: doc.id,
        deskName: doc.data()["deskName"],
        deskCreateTime: doc.data()["deskCreateTime"],
      });
    });
  },
};
</script>
