<template>
  <div class="card">
    <div v-if="!isEditing" @click="isEditing = !isEditing" class="card-header">
      {{ category.categoryName }}
    </div>
    <div v-else class="card-body">
      <form @submit.prevent="guncelle">
        <div class="form-group">
          <label :for="`kategoriAdi${index}`">Kategori Adı</label>
          <input v-model="kategoriAdi" class="form-control" type="text" />
        </div>
        <br />

        <div class="form-group">
          <button type="submit" class="btn btn-primary">Güncelle</button>
          <div class="col"></div>

          <button class="btn btn-danger" @click.prevent="sil">SİL</button>
          <div class="col"></div>
          <div class="col">
            <button
              @click.prevent="isEditing = !isEditing"
              class="btn btn-default"
            >
              İptal
            </button>
          </div>
          <div class="alert" :class="alert_variant" v-if="show_alert">
            {{ alert_text }}
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
  name: "UrunKategoriDuzenle",
  props: {
    category: {
      type: Object,
    },
    stateDuzenle: {
      type: Function,
    },
    index: {
      required: true,
    },
  },
  created() {
    this.kategoriAdi = this.category.categoryName;
  },
  data() {
    return {
      show_alert: false,
      alert_text: "Güncelleniyor lütfen bekleyin",
      alert_variant: "alert-primary",
      kategoriAdi: "",
      isEditing: false,
    };
  },
  methods: {
    ...mapActions(["deleteCategory", "updateCategory"]),
    async guncelle() {
      this.show_alert = true;
      this.alert_text = "Güncelleniyor lütfen bekleyin";
      this.alert_variant = "alert-primary";
      try {
        await this.updateCategory({
          id: this.category.categoryId,
          categoryName: this.kategoriAdi,
        });
      } catch (ex) {
        this.alert_text = "Güncellenirken hata oluştu!" + ex;
        this.alert_variant = "alert-danger";
        return;
      }
      this.alert_text = "Güncelleme başarılı!";
      this.alert_variant = "alert-success";
      setTimeout(() => {
        this.isEditing = false;
      }, 3000);
    },
    sil() {
      swal({
        text: "Silmek istediğinize emin misiniz?",
        icon: "info",
        buttons: {
          ok: {
            text: "Evet",
            value: true,
            className: "btn btn-primary",
          },
          cancel: {
            visible: true,
            text: "Iptal",
            value: false,
            className: "btn btn-danger",
          },
        },
      }).then(async (result) => {
        if (result) {
          try {
            await this.deleteCategory({
              id: this.category.categoryId,
              index: this.index,
            });
          } catch (ex) {
            swal("Silinirken Hata oluştu!" + ex);
            return;
          }
          swal("Başarıyla silindi!");
        }
      });
    },
  },
};
</script>
