<template>
  <div class="row">
    <div class="col-md-3" v-for="urun in urunler" :key="urun.productId">
      <siparis-kategori-urun-item :sepeteEkle="sepeteEkle" :urun="urun" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SiparisKategoriUrunItem from "@/components/Siparis/SiparisKategoriUrunItem.vue";

export default {
  name: "SiparisKategoriUrunleri",
  components: {
    SiparisKategoriUrunItem,
  },
  props: {
    category: {
      type: String,
      required: true,
    },
    sepeteEkle: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      urunler: [],
    };
  },
  computed: {
    ...mapGetters(["getProductsByCategoryId"]),
  },
  mounted() {
    this.urunler = this.getProductsByCategoryId(this.category);
  },
};
</script>
