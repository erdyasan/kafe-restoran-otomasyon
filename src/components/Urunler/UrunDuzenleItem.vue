<template>
  <div class="card" :class="{ 'border border-successt': isEditing }">
    <div @click.prevent="isEditing = !isEditing" class="card-header">
      {{ urun.productName }}
    </div>
    <div v-if="isEditing" class="card-body">
      <form @submit.prevent="urunGuncelle">
        <div class="form-group">
          <label :for="urun.productId">Kategori Seçiniz</label>
          <select
            v-model="urunKategorisi"
            class="form-control"
            name="kategori"
            :id="urun.productId"
          >
            <option
              v-for="kategori in kategoriler"
              :key="kategori.categoryId"
              :value="kategori.categoryId"
            >
              {{ kategori.categoryName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label :for="`urunAdi${urun.productName}`">Ürün Adı</label>
          <input
            v-model="urunAdi"
            type="text"
            :id="`urunAdi${urun.productName}`"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label :for="`urunFiyati${urun.productId}`">Ürün Fiyatı</label>
          <input
            type="number"
            class="form-control"
            step="0.01"
            :id="`urunFiyati${urun.productId}`"
            v-model="urunFiyati"
          />
        </div>
        <div class="row">
          <div class="col">
            <button
              style="width: 100%"
              class="btn btn-success"
              type="submit"
              :disabled="isDeleting"
            >
              Güncelle
            </button>
            <button
              @click.prevent="urunSil"
              style="width: 100%"
              class="btn btn-danger"
            >
              SİL
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import swal from "sweetalert";
export default {
  name: "UrunDuzenleItem",
  props: {
    urun: {
      type: Object,
      required: true,
    },
    kategoriler: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      urunKategorisi: "",
      urunAdi: "",
      urunFiyati: 0,
      isDeleting: false,
    };
  },
  created() {
    this.urunKategorisi = this.urun.productCategory;
    this.urunAdi = this.urun.productName;
    this.urunFiyati = this.urun.productPrice;
  },
  methods: {
    ...mapActions(["updateProduct", "deleteProduct"]),
    async urunGuncelle() {
      const urunAdi = this.urunAdi;
      const urunKategorisi = this.urunKategorisi;
      const urunFiyati = parseFloat(this.urunFiyati);
      if (typeof urunFiyati === "number") {
        try {
          await this.updateProduct({
            productId: this.urun.productId,
            productName: urunAdi,
            productCategory: urunKategorisi,
            productPrice: urunFiyati,
          });
        } catch (ex) {
          swal("Ürün gücellemesi başarısız!");
          return;
        }
        swal("Ürün başarıyla güncellendi!");
      }
    },
    async urunSil() {
      this.isDeleting = true;
      swal({
        text: "Silmek istediğinize emin misiniz?",
        icon: "info",
        buttons: {
          cancel: {
            visible: true,
            value: false,
            text: "İptal",
            className: "btn btn-danger",
          },
          ok: {
            visible: true,
            text: "Evet",
            value: true,
            className: "btn btn-success",
          },
        },
      }).then((result) => {
        if (result) {
          this.deleteProduct(this.urun.productId);
        }
      });

      this.isDeleting = false;
    },
  },
};
</script>
