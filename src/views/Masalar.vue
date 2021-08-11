<template>
  <div class="row">
    <div class="col-md-4">
      <div class="alert" :class="alert_variant" v-if="show_alert">
        {{ alert_text }}
      </div>
      <form @submit.prevent="addDesk2">
        <div class="form-group">
          <label for="deskName">Masa adı veya numarası</label>
          <input
            v-model="deskName"
            id="deskName"
            type="text"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <button type="submit" class="form-control btn btn-primary">
            Ekle
          </button>
        </div>
      </form>
    </div>
    <div class="col-md-8">
      <div class="form-group">
        <label for="arama">Masa arama</label>
        <input
          id="arama"
          type="search"
          class="form-control"
          @input="search"
          v-model="filt"
        />
      </div>
      <hr />
      <masa-item
        v-for="(desk, index) in deskList"
        :sil="deleteDesk"
        :index="index"
        :key="desk.deskId"
        :masa="desk"
        :masaGuncelle="updateDesk"
      />
    </div>
  </div>
</template>

<script>
import { auth, desksCollection } from "@/includes/firebase";
import { mapActions, mapState } from "vuex";
import MasaItem from "@/components/MasaItem/MasaItem";
export default {
  name: "Masalar",
  components: {
    MasaItem,
  },

  computed: {
    ...mapState(["desks"]),
    deskList() {
      if (this.filt.length < 1) {
        return this.desks;
      }

      return this.desks.filter((desk) =>
        desk.deskName.toLowerCase().indexOf(this.filt.toLowerCase()) > -1
          ? desk
          : ""
      );
    },
  },
  data() {
    return {
      filt: "",
      show_alert: false,
      alert_text: "Masa ekleniyor lütfen bekleyiniz!",
      alert_variant: "alert-primary",
      deskName: "",
    };
  },
  async created() {
    const getDesks = await desksCollection
      .where("userId", "==", auth.currentUser.uid)
      .get();

    const tempDesks = [];
    getDesks.forEach((doc) => {
      tempDesks.push({
        deskId: doc.id,
        deskName: doc.data()["deskName"],
      });
    });
    tempDesks.sort((a, b) => {
      if (a.deskCreateTime > b.deskCreateTime) {
        return a;
      } else {
        return b;
      }
    });
    this.desks = tempDesks;
  },
  methods: {
    ...mapActions(["addDesk"]),
    sortList() {
      this.desks.sort((a, b) => {
        if (a.deskCreateTime > b.deskCreateTime) {
          return a;
        } else {
          return b;
        }
      });
    },
    async addDesk2() {
      this.show_alert = true;
      this.alert_text = "Masa ekleniyor lütfen bekleyiniz";
      this.alert_variant = "alert-primary";
      try {
        let date = new Date().toString();
        await this.addDesk({
          deskName: this.deskName,
          deskCreateTime: date,
        });
        this.sortList();
      } catch (ex) {
        this.alert_text = "Masa eklenirken hata oluştu!";
        this.alert_variant = "alert-danger";
      }

      this.deskName = "";
      this.alert_text = "Masa başarıyla eklendi";
      this.alert_variant = "alert-success";
    },
    deleteDesk(index) {
      this.desks.splice(index, 1);
    },
    updateDesk(index, values) {
      this.desks[index].deskName = values;
    },
  },
};
</script>
