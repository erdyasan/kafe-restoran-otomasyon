<template>
  <div class="row">
    <div class="row">
      <button
        @click.prevent="$router.push({ name: 'Kasa' })"
        class="btn btn-primary"
      >
        Kasaya geri dön
      </button>
    </div>
    <div class="d-flex justify-content-center">
      <h1>Masa Adı "{{ $route.params.deskName }}"</h1>
    </div>
    <div class="col-md-6">
      <div class="d-flex justify-content-center">
        <h2>Masa Siparişleri</h2>
        <br />
        <div class="row">
          <div class="col-md-12">
            <button
              @click.prevent="tumurunleriFiseEkle"
              style="width: 100%"
              class="form-control btn btn-success"
            >
              Tüm ürünleri ekle
            </button>
          </div>
        </div>
      </div>
      <div v-for="order in orders" :key="order.orderId" class="card mt-2">
        <div class="card-header">
          {{ order.productCount }} adet {{ order.productName }}
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <button
                @click.prevent="
                  fise1AdetEkle(
                    order.productId,
                    order.productName,
                    order.productPrice,
                    order.productCount
                  )
                "
                class="form-control btn btn-success"
              >
                1 Adet ekle
              </button>
            </div>
          </div>
          <button
            @click.prevent="
              fiseTumUrunleriEkle(
                order.productId,
                order.productCount,
                order.productName,
                order.productPrice
              )
            "
            class="form-control btn btn-primary"
          >
            Tümünü fişe ekle
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div v-if="fis.totalPrice != 0" class="alert alert-primary">
          Toplam Ücret {{ fis.totalPrice }} <br />
          Alınan Para :
          <input
            v-model="alinanPara"
            type="number"
            class="form-control"
            @input.prevent="paraUstuHesapla"
          />
        </div>
        <br />
        <template v-if="this.fis.totalPrice != 0">
          <button
            v-for="rp in read_price"
            @click.prevent="set_alinan_para(rp)"
            :key="rp"
            class="btn btn-primary mt-1"
          >
            {{ rp }}
          </button>
          <button @click.prevent="alinanPara = 0" class="btn btn-primary mt-1">
            0
          </button>
          <button @click.prevent="fisIptal" class="btn btn-danger mt-1">
            FİŞİ İPTAL ET
          </button>
        </template>
        <div v-if="show_para_ustu" class="alert alert-primary">
          Vermeniz gereken para üstü: {{ paraUstu }}
        </div>
        <button
          v-if="fis.orders.length > 0"
          @click.prevent="fisHesabiKapat"
          class="btn btn-success mt-1"
        >
          Fişi öde ve kapat
        </button>
      </div>
      <div
        v-for="fisOrder in fis.orders"
        :key="fisOrder.productId + 1"
        class="card mt-2"
      >
        <div class="card-header">
          {{ fisOrder.productCount }} adet {{ fisOrder.productName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ordersCollection, auth } from "@/includes/firebase";
export default {
  name: "KasaDetail",
  data() {
    return {
      unFilteredOrders: [],
      orders: [],
      fis: { orders: [], totalPrice: 0 },
      alinanPara: 0,
      paraUstu: 0,
      show_para_ustu: false,
      read_price: [5, 10, 15, 20, 50],
    };
  },
  async mounted() {
    await ordersCollection
      .where("userId", "==", auth.currentUser.uid)
      .where("deskId", "==", this.$route.params.id)
      .where("paid", "==", false)
      .onSnapshot((snapshot) => {
        this.orders = [];
        this.unFilteredOrders = [];
        snapshot.forEach((doc) => {
          this.unFilteredOrders.push({ orderId: doc.id, ...doc.data() });
        });
        this.unFilteredOrders.forEach((unfOrder) => {
          if (this.orders.length == 0) {
            this.orders.push({ ...unfOrder });
            return;
          } else {
            let isHas = false;
            this.orders.forEach((orderItem) => {
              if (unfOrder.productId == orderItem.productId) {
                isHas = true;
                orderItem.productCount =
                  orderItem.productCount + unfOrder.productCount;
              }
            });
            if (!isHas) {
              this.orders.push({ ...unfOrder });
            }
          }
        });
      });
  },
  methods: {
    fisIptal() {
      this.show_para_ustu = false;
      this.fis = { orders: [], totalPrice: 0 };
    },
    paraUstuHesapla() {
      this.show_para_ustu = true;
      this.paraUstu = this.alinanPara - this.fis.totalPrice;
    },
    set_alinan_para(para) {
      if (this.alinanPara == 0) {
        this.alinanPara = parseInt(para);
      } else {
        this.alinanPara = parseInt(this.alinanPara) + para;
      }
      this.paraUstuHesapla();
    },
    fiseTumUrunleriEkle(id, count, pName, price) {
      //sadece 1 adet üründen kaç adet sipariş verildiyse tamamını ekler
      if (this.fis.orders.length == 0) {
        this.fis.orders.push({
          productId: id,
          productName: pName,
          productCount: count,
        });
        this.fis.totalPrice = this.fis.totalPrice + count * price;
      } else {
        let isHas = false;
        this.fis.orders.forEach((onFis) => {
          if (id == onFis.productId) {
            isHas = true;
            if (count != onFis.productCount) {
              this.fis.totalPrice =
                this.fis.totalPrice + (count - onFis.productCount) * price;
              onFis.productCount = count;
            }
          }
        });
        if (!isHas) {
          this.fis.orders.push({
            productId: id,
            productName: pName,
            productCount: count,
          });
          this.fis.totalPrice = this.fis.totalPrice + count * price;
        }
        if (this.alinanPara > 0) {
          this.paraUstuHesapla();
        }
      }
    },
    fise1AdetEkle(id, name, price, orderCount) {
      let added = false;
      if (this.fis.orders.length == 0) {
        this.fis.orders.push({
          productId: id,
          productName: name,
          productCount: 1,
        });
        added = true;
      } else {
        let isHas = false;
        this.fis.orders.forEach((fisOrder) => {
          if (fisOrder.productId == id) {
            isHas = true;
            if (fisOrder.productCount + 1 <= orderCount) {
              fisOrder.productCount = fisOrder.productCount + 1;
              added = true;
            }
          }
        });
        if (!isHas) {
          this.fis.orders.push({
            productId: id,
            productName: name,
            productCount: 1,
          });
          added = true;
        }
      }
      if (added) {
        this.fis.totalPrice = this.fis.totalPrice + price;
      }
      if (this.alinanPara > 0) {
        this.paraUstuHesapla();
      }
    },
    tumurunleriFiseEkle() {
      //Masadaki bütün siparişleri fişe ekler
      this.fis.orders = this.orders;
      let totalPrice = 0;
      this.orders.forEach((order) => {
        totalPrice += order.productCount * order.productPrice;
      });
      this.fis.totalPrice = totalPrice;
    },
    fisHesabiKapat() {
      let islemler = [];
      //islemler dizisine islem yapılacak order ID lerini verir!
      this.fis.orders.forEach((fisOrder) => {
        this.unFilteredOrders.forEach((deskUnfilteredOrder) => {
          if (fisOrder.productCount <= 0) {
            return;
          }
          if (
            fisOrder.productId == deskUnfilteredOrder.productId &&
            fisOrder.productCount > 0
          ) {
            if (fisOrder.productCount == deskUnfilteredOrder.productCount) {
              islemler.push({
                orderId: deskUnfilteredOrder.orderId,
                productId: fisOrder.productId,
                yeniCount: 0,
              });

              fisOrder.productCount = 0;
            } else if (
              fisOrder.productCount > deskUnfilteredOrder.productCount
            ) {
              islemler.push({
                orderId: deskUnfilteredOrder.orderId,
                productId: fisOrder.productId,
                yeniCount: 0,
              });

              fisOrder.productCount =
                fisOrder.productCount - deskUnfilteredOrder.productCount;
            } else if (
              fisOrder.productCount < deskUnfilteredOrder.productCount
            ) {
              islemler.push({
                orderId: deskUnfilteredOrder.orderId,
                productId: fisOrder.productId,
                yeniCount:
                  deskUnfilteredOrder.productCount - fisOrder.productCount,
              });

              fisOrder.productCount = 0;
            }
          }
        });
      });
      this.islemleriGerceklestir(islemler);
    },
    async islemleriGerceklestir(islemler) {
      islemler.forEach(async (islem) => {
        if (islem.yeniCount == 0) {
          await ordersCollection.doc(islem.orderId).update({ paid: true });
        } else {
          await ordersCollection
            .doc(islem.orderId)
            .update({ productCount: islem.yeniCount });
        }
      });

      this.fis.orders = [];
      this.fis.totalPrice = 0;
      this.show_para_ustu = false;
    },
  },
};
</script>
