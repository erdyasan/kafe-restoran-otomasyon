<template>
  <div class="card">
    <div class="card-header">
      {{ desk.deskName }}
      <button @click.prevent="sec" class="btn btn-primary">
        Detaylı işlem için seç
      </button>
      <div class="alert" :class="alert_variant" v-if="show_alert">
        {{ alert_text }}
      </div>
    </div>
    <div class="card-body">
      <ul>
        <li v-for="order in desk.orders" :key="order.orderId">
          {{ order.productName }} -- {{ order.productCount }}
        </li>
      </ul>
    </div>
    <div class="card-footer">
      Toplam Fiyat :{{ desk.totalPrice }} <br />
      <input @input="hesapla" type="number" v-model="alinanPara" step="0.01" />
      <button @click.prevent="paraGiris(5)" class="btn btn-primary">5</button>
      <button @click.prevent="paraGiris(10)" class="btn btn-primary">10</button>
      <button @click.prevent="paraGiris(20)" class="btn btn-primary">20</button>
      <button @click.prevent="paraGiris(50)" class="btn btn-primary">50</button>
      <button @click.prevent="paraGiris(0)" class="btn btn-primary">0</button>
      <div class="alert alert-success" v-if="show_para_ustu">
        Vermeniz gereken para üstü <b>{{ para_ustu }}</b>
      </div>
      <button
        @click.prevent="hesabiKapat"
        class="form-control btn btn-success mt-1"
      >
        Hesabı kapat
      </button>
    </div>
  </div>
</template>

<script>
import { ordersCollection } from "@/includes/firebase";
export default {
  name: "KasaMasaItem",
  props: {
    desk: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      alinanPara: 0,
      show_para_ustu: false,
      para_ustu: 0,
      is_submitting: false,
      show_alert: false,
      alert_text: "Hesap kapanıyor lütfen bekleyiniz..",
      alert_variant: "alert-primary",
    };
  },
  methods: {
    hesapla() {
      this.show_para_ustu = true;
      this.para_ustu = this.alinanPara - this.desk.totalPrice;
    },
    paraGiris(para) {
      if (para == 0) {
        this.alinanPara = 0;
        this.show_para_ustu = false;
        return;
      }
      this.alinanPara = parseFloat(para) + parseFloat(this.alinanPara);
      this.hesapla();
    },
    async hesabiKapat() {
      this.show_alert = true;
      this.alert_text = "Lütfen bekleyiniz...";
      this.alert_variant = "alert-primary";
      try {
        this.desk.unFilteredOrders.forEach(async (order) => {
          await ordersCollection.doc(order.orderId).update({ paid: true });
        });
      } catch (ex) {
        this.alert_text = "Hesap ödeme işlemi sırasında bir hata oluştu!" + ex;
        this.alert_variant = "alert-danger";
        return;
      }
      this.alert_text = "Hesap ödeme işlemi başarılı!";
      this.alert_variant = "alert-success";
    },
    sec() {
      this.$router.push({
        name: "KasaDetail",
        params: { id: this.desk.deskId, deskName: this.desk.deskName },
      });
    },
  },
};
</script>
