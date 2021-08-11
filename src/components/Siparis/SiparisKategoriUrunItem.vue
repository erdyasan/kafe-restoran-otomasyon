<template>
  <div class="card mt-2">
    <div @click.prevent="showData = !showData" class="card-header">
      {{ urun.productName }}
    </div>
    <div v-if="showData" class="card-body">
      <form @submit.prevent="urunuEkle">
        <div class="form-group">
          <label :for="`urunAdet${urun.productName}`"> Adet giriniz </label>
          <input
            @click="urunadet = ''"
            :id="`urunAdet${urun.productName}`"
            v-model="urunAdet"
            type="number"
            step="1"
            class="form-control"
            min="1"
          />
        </div>
        <div class="form-group">
          <div class="row">
            <div class="col-md-6">
              <button
                @click.prevent="adetAzalt"
                class="form-control btn btn-danger rounded"
              >
                -
              </button>
            </div>
            <div class="col-md-6">
              <button
                @click.prevent="adetArttir"
                class="form-control btn btn-success rounded"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary form-control">
            Sepete Ekle
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SiparisKategoriUrunItem",
  props: {
    urun: {
      type: Object,
      required: true,
    },
    sepeteEkle: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      urunAdet: 1,
      showData: false,
    };
  },
  methods: {
    adetArttir() {
      this.urunAdet = this.urunAdet + 1;
    },
    adetAzalt() {
      if (this.urunAdet >= 2) this.urunAdet = this.urunAdet - 1;
    },
    urunuEkle() {
      let tarih = new Date();
      let adet = parseInt(this.urunAdet);
      this.sepeteEkle({
        productId: this.urun.productId,
        productName: this.urun.productName,
        productAddDate: tarih,
        productCount: adet,
        productPrice: this.urun.productPrice,
      });
    },
  },
};
</script>
