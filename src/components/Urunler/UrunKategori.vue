<template>
  <div class="card">
    <div class="card-header">Kategori Ekle</div>
    <div class="card-body">
      <form @submit.prevent="ekle">
        <div class="form-group">
          <label for="kategoriAdi">Kategori Adı</label>
          <input
            v-model="kategoriAdi"
            type="text"
            id="kategoriAdi"
            class="form-control"
          />
        </div>
        <br />
        <div class="form-group">
          <button type="submit" class="form-control btn btn-primary">
            Ekle
          </button>
        </div>
      </form>
      <hr />
      <button
        @click="filterList = ''"
        v-if="filterList.length > 0"
        class="form-control btn btn-primary"
      >
        Temizle
      </button>
      <div class="form-group">
        <label for="arama">Arama:</label>
        <input
          id="arama"
          type="search"
          class="form-control"
          v-model="filterList"
        />
      </div>

      <hr />
      <urun-kategori-duzenle
        v-for="(cat, index) in filteredList"
        :key="cat.categoryId"
        :index="index"
        :category="cat"
      />
    </div>
    <div v-if="show_alert" class="card-footer">
      <div class="alert" :class="alert_variant">
        {{ alert_text }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UrunKategoriDuzenle from "@/components/Urunler/UrunKategoriDuzenle";
export default {
  name: "UrunKategori",
  components: {
    UrunKategoriDuzenle,
  },
  data() {
    return {
      filterList: "",
      kategoriAdi: "",
      show_alert: false,
      alert_variant: "alert-primary",
      alert_text: "Kategori Ekleniyor bekleyiniz.",
    };
  },
  computed: {
    ...mapState({
      categories: (state) => state.category.categories,
    }),
    filteredList() {
      if (this.filterList.length > 0) {
        return this.categories.filter((record) => {
          return record.categoryName
            .toLowerCase()
            .indexOf(this.filterList.toLowerCase()) > -1
            ? record
            : null;
        });
      }
      return this.categories;
    },
  },
  methods: {
    ...mapActions(["addCategory"]),
    async ekle() {
      this.alert_variant = "alert-primary";
      this.alert_text = "Kategori Ekleniyor bekleyiniz.";
      this.show_alert = true;

      try {
        let tarih = new Date();
        this.addCategory({ kategoriAdi: this.kategoriAdi, tarih: tarih });
      } catch (ex) {
        this.alert_variant = "alert-success";
        this.alert_text = "Kategori Eklenirken hata oluştu!" + ex;
        setTimeout(() => {
          this.show_alert = false;
        }, 3000);
        return;
      }
      this.alert_variant = "alert-success";
      this.alert_text = "Kategori Başarıyla Eklendi.";
      setTimeout(() => {
        this.show_alert = false;
      }, 3000);
    },
  },
};
</script>
