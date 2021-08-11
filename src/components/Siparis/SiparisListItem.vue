<template>
  <div class="card">
    <div @click.prevent="showDetail = !showDetail" class="card-header">
      {{ urun.productCount }} adet {{ urun.productName }}
    </div>
    <div v-if="showDetail" class="card-body">
      Ürün adı :{{ urun.productName }}
      <br />
      Ürün Fiyatı : {{ urun.productPrice }}
      <br />
      Sipariş Verilme Zamanı : {{ urun.tarih }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SiparisListItem",
  props: {
    urun: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDetail: false,
    };
  },
};
</script>
