<template>
  <div class="row mt-5">
    <div class="col-md-4">
      <urun-kategori />
    </div>
    <div class="col-md-4">
      <urun-item
        :diziyeUrunEkle="urunEkle"
        v-if="categories.length > 0"
        :categories="categories"
      />
    </div>
    <div class="col-md-4">
      <urun-duzenle-item
        v-for="urun in products"
        :key="urun.productId"
        :urun="urun"
        :kategoriler="categories"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UrunKategori from "@/components/Urunler/UrunKategori.vue";
import UrunItem from "@/components/Urunler/UrunItem";
import UrunDuzenleItem from "@/components/Urunler/UrunDuzenleItem";
import { productsCollection, auth } from "@/includes/firebase";
export default {
  name: "Urunler",
  data() {
    return {
      urunler: [],
    };
  },
  computed: {
    ...mapState({
      categories: (state) => state.category.categories,
      products: (state) => state.product.products,
    }),
  },
  async created() {
    const productsSnapshot = await productsCollection
      .where("userId", "==", auth.currentUser.uid)
      .get();

    let uruns = [];
    productsSnapshot.forEach((doc) => {
      uruns.push({
        productId: doc.id,
        productName: doc.data()["productName"],
        productCategory: doc.data()["productCategory"],
        productPrice: doc.data()["productPrice"],
        productAddDate: doc.data()["productAddDate"],
      });
    });
    this.urunler = uruns;
  },
  methods: {
    urunEkle(product) {
      this.urunler.push(product);
    },
  },
  components: {
    UrunKategori,
    UrunItem,
    UrunDuzenleItem,
  },
};
</script>
