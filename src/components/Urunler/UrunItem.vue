<template>
  <div class="card">
    <div class="card-header">Ürün ekleyebilirsiniz!</div>
    <div class="card-body">
      <form @submit.prevent="urunEkle">
        <div class="form-group">
          <label for="urunKategori">Ürün Kategorisi</label>
          <select id="urunKategori" class="form-control" v-model="kategori">
            <option
              v-for="category in categories"
              :key="category.categoryId"
              :value="category.categoryId"
            >
              {{ category.categoryName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="urunAdi"> Ürün adın nedir? </label>
          <input v-model="urunAdi" type="text" class="form-control" />
        </div>
        <div class="form-group">
          <label for="urunFiyati">Ürün fiyatı nedir?</label>
          <input
            v-model="urunFiyati"
            step="0.1"
            type="number"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <button class="form-control btn btn-success" type="submit">
            Ekle
          </button>
        </div>
      </form>
    </div>
    <div v-if="show_alert" class="card-footer">
      <div class="alert" :class="alert_variant">
        {{ alert_text }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "UrunItem",
  props: {
    categories: {
      type: Array,
      required: true,
    },
    diziyeUrunEkle: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      kategori: "",
      urunAdi: "",
      urunFiyati: 0,
      alert_variant: "alert-primary",
      alert_text: "Lütfen bekleyin ekleniyor...",
      show_alert: false,
    };
  },
  created() {
    this.kategori = this.categories[0].categoryId;
  },
  methods: {
    ...mapActions(["addProduct"]),
    async urunEkle() {
      const urunAdi = this.urunAdi;
      const urunFiyat = parseFloat(this.urunFiyati);
      const kategori = this.kategori;
      this.alert_variant = "alert-primary";
      this.alert_text = "Lütfen bekleyiniz ürün eklenior...";
      this.show_alert = true;
      try {
        const tarih = new Date();
        await this.addProduct({
          urunAdi: urunAdi,
          kategori: kategori,
          urunFiyat: urunFiyat,
          tarih: tarih,
        });
      } catch (ex) {
        this.alert_variant = "alert-danger";
        this.alert_text = "Ürün eklenirken hata oluştu" + ex;
        return;
      }
      this.alert_variant = "alert-success";
      this.alert_text = "Ürün başarıyla eklendi!";
    },
  },
};
</script>
