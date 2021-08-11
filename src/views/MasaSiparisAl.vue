<template>
  <div class="row">
    <div v-if="seciliKategori == null" class="row m-2">
      <button
        @click.prevent="$router.push({ name: 'Siparis' })"
        class="form-control btn btn-primary"
      >
        Masalara Dön
      </button>
    </div>
    <div v-if="!seciliKategori" class="col-md-6">
      <div class="row">
        <div
          class="col-md-3"
          v-for="category in categories"
          :key="category.categoryId"
        >
          <siparis-kategorileri
            :category="category"
            :kategoriSec="kategoriSec"
          />
        </div>
      </div>
    </div>
    <div v-else class="col-md-6">
      <div class="row mt-3">
        <button
          @click.prevent="seciliKategori = null"
          class="form-control btn btn-primary"
        >
          Kategorilere Dön
        </button>
      </div>
      <siparis-kategori-urunleri
        :sepeteEkle="sepeteEkle"
        :category="seciliKategori"
      />
    </div>

    <div class="col-md-3" v-if="sepet.length > 0">
      <div class="alert" :class="alert_variant" v-if="show_alert">
        {{ alert_text }}
      </div>
      <button @click.prevent="sepetiTemizle">Sepeti Temizle</button>
      <ul>
        <li v-for="sepetItem in sepet" :key="sepetItem.productId">
          {{ sepetItem.productName }} adet {{ sepetItem.productCount }}
          <button
            @click.prevent="sepet1AdetCikar(sepetItem.productId)"
            class="btn btn-danger"
          >
            -1
          </button>
          <button
            @click.prevent="sepet1AdetEkle(sepetItem.productId)"
            class="btn btn-success"
          >
            +1
          </button>
        </li>
      </ul>
      <button
        @click.prevent="siparisVer"
        class="btn btn-success"
        :disable="isSubmitting"
      >
        Sipariş ver
      </button>
    </div>
    <div v-if="siparisListesi.length > 0" class="col-md-3">
      <div class="row mt-2">
        <div class="alert alert-primary">Toplam Fiyat : {{ toplamFiyat }}</div>
      </div>
      <siparis-list-item
        v-for="siparis in siparisListesi"
        :key="siparis.orderId"
        :urun="siparis"
      />
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import { auth } from "@/includes/firebase";
import { mapState } from "vuex";
import { ordersCollection } from "@/includes/firebase";
import SiparisListItem from "@/components/Siparis/SiparisListItem.vue";
import SiparisKategorileri from "@/components/Siparis/SiparisKategorileri";
import SiparisKategoriUrunleri from "@/components/Siparis/SiparisKategoriUrunleri";
export default {
  name: "MasaSiparisAl",
  components: {
    SiparisKategorileri,
    SiparisKategoriUrunleri,
    SiparisListItem,
  },
  data() {
    return {
      seciliKategori: null,
      sepet: [],
      toplamFiyat: 0,
      siparisListesi: [],
      isSubmitting: false,
      show_alert: false,
      alert_variant: "alert-primary",
      alert_text: "Lütfen bekleyiniz ekleniyor...",
    };
  },
  async mounted() {
    await ordersCollection
      .where("deskId", "==", this.$route.params.id)
      .where("paid", "==", false)
      .onSnapshot((snapshot) => {
        this.toplamFiyat = 0;
        let siparis = [];
        snapshot.forEach((order) => {
          let urunAdet = parseFloat(order.data()["productCount"]);
          let urunFiyat = parseFloat(order.data()["productPrice"]);
          console.log("Ürün adet ve fiyatı " + urunAdet + "-" + urunFiyat);
          this.toplamFiyat = this.toplamFiyat + urunAdet * urunFiyat;
          siparis.push({
            orderId: order.id,
            ...order.data(),
          });
          this.siparisListesi = siparis;
        });
      });
  },
  computed: {
    ...mapState(["categories"]),
  },
  methods: {
    kategoriSec(value) {
      this.seciliKategori = value;
    },
    sepeteEkle(value) {
      if (this.sepet.length == 0) {
        this.sepet.push(value);
        return;
      }
      let eklendi = false;
      this.sepet.forEach((x) => {
        if (x.productId === value.productId) {
          x.productCount = x.productCount + value.productCount;
          eklendi = true;
        }
      });
      if (!eklendi) {
        this.sepet.push(value);
      }
    },
    sepetiTemizle() {
      this.sepet = [];
    },
    sepet1AdetEkle(id) {
      this.sepet.forEach((x) => {
        if (x.productId === id) {
          x.productCount = x.productCount + 1;
        }
      });
    },
    sepet1AdetCikar(id) {
      let adet = 0;
      this.sepet.forEach((x) => {
        if (x.productId === id) {
          adet = x.productCount;
          if (adet - 1 != 0) {
            x.productCount = x.productCount - 1;
          }
        }
      });
      if (adet - 1 != 0) {
        return;
      }
      let index = this.sepet.findIndex((x) => x.productId === id);
      this.sepet.splice(index, 1);
    },
    async siparisVer() {
      this.isSubmitting = true;
      this.show_alert = true;
      this.alert_text = "Lütfen bekleyiniz ekleniyor";
      this.alert_variant = "alert-primary";
      let hata = false;
      this.sepet.forEach(async (x) => {
        try {
          await ordersCollection.add({
            deskId: this.$route.params.id,
            productId: x.productId,
            productCount: x.productCount,
            productName: x.productName,
            productAddDate: x.productAddDate,
            productPrice: x.productPrice,
            tarih: x.productAddDate.toString(),
            paid: false,
            orderReady: false,
            userId: auth.currentUser.uid,
          });
        } catch (ex) {
          swal("Sipariş verilirken Hata oluştu!");
          hata = true;
          return;
        }
      });
      if (hata) {
        this.alert_variant = "alert-danger";
        this.alert_text = "Sipariş verme sırasında hata oluştu!";
        this.isSubmitting = false;
        this.sepet = [];
        setTimeout(() => {
          this.show_alert = false;
        }, 3000);
        return;
      }
      this.sepet = [];
      this.alert_variant = "alert-success";
      this.alert_text = "Sipariş başarılı bir şekilde verildi!";
      this.isSubmitting = false;
      swal({
        icon: "success",
        text: "Sipariş Başarılı bir şekilde verildi!",
      });
      setTimeout(() => {
        this.show_alert = false;
      }, 3000);
    },
  },
};
</script>
