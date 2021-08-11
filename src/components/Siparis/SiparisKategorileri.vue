<template>
  <div @click.prevent="kategoriSec(category.categoryId)" class="card">
    <div class="card-header">
      {{ category.categoryName }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SiparisKategorileri",
  props: {
    category: {
      type: Object,
      required: true,
    },
    kategoriSec: {
      type: Function,
      required: true,
    },
  },
};
</script>
