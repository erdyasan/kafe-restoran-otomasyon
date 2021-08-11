<template>
  <div class="card">
    <div class="card-header">
      <p>
        {{ masa.deskName }}
      </p>
      <button @click.prevent="duzenle = !duzenle" class="btn btn-primary">
        Düzenle
      </button>
      <button @click="masaSil" class="btn btn-danger">Sil</button>
    </div>
    <div v-if="duzenle" class="card-body">
      <div class="alert" :class="alert_variant" v-if="show_alert">
        {{ alert_text }}
      </div>
      <form @submit.prevent="guncelle">
        <div class="form-groyu">
          <label for="masaAdi">Masa Adı</label>
          <input
            v-model="masaAdi"
            type="text"
            id="masaAdi"
            class="form-control"
          />
        </div>
        <div class="form-grou">
          <button class="form-control btn btn-success">Kaydet</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import swal from "sweetalert";
export default {
  name: "MasaItem",
  props: {
    masa: {
      type: Object,
      required: true,
    },
    index: {
      required: true,
    },
    sil: {
      type: Function,
      required: true,
    },
    masaGuncelle: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      duzenle: false,
      masaAdi: "",
      show_alert: false,
      alert_text: "Masa güncelleniyor...",
      alert_variant: "alert-primary",
    };
  },
  created() {
    this.masaAdi = this.masa.deskName;
  },
  methods: {
    ...mapActions(["updateDesk", "deleteDesk"]),
    async guncelle() {
      this.show_alert = true;
      this.alert_text = "Masa güncelleniyor!";
      this.alert_variant = "alert-primary";
      try {
        await this.updateDesk({
          deskId: this.masa.deskId,
          deskName: this.deskName,
        });
      } catch (ex) {
        this.alert_text = "Masa güncelenirken hata oluştu!" + ex;
        this.alert_variant = "alert-danger";
        return;
      }

      this.masaGuncelle(this.index, this.masaAdi);
      this.alert_text = "Masa güncellemesi başarılı!";
      this.alert_variant = "alert-success";
      this.duzenle = false;
    },
    async masaSil() {
      await swal({
        text: "Silmek istediğinize emin misiniz?",
        buttons: {
          cancel: {
            text: "İptal",
            value: null,
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Evet",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          },
        },
      }).then(async (result) => {
        if (result) {
          this.show_alert = true;
          this.alert_text = "Masa Siliniyor!";
          this.alert_variant = "alert-primary";
          try {
            await this.deleteDesk(this.masa.deskId);
          } catch (ex) {
            this.alert_text = "Masa silinirken hata oluştu!" + ex;
            this.alert_variant = "alert-danger";
            return;
          }
          this.sil(this.index);
          this.alert_text = "Masa silinmesi başarılı!";
          this.alert_variant = "alert-success";
          this.duzenle = false;
        }
      });
    },
  },
};
</script>
