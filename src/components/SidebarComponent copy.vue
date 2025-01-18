<template>
  <div v-if="parkingInfo && parkingInfo.ryokinData && parkingInfo.ryokinData.length > 0">

    <h2>{{ parkingInfo.name }}</h2> 
    <a :href="parkingInfo.url" target="_blank">駐車場の詳細を見る</a>
    <ul class="p-price_items">
      <li class="p-price_items_list_first">
        <p class="p-price_items_list_first_ttl js-align1" style="height: 54px;">　</p>
        <div class="p-price_items_list_first_wrap">
          <p class="p-price_items_list_first_subTtl js-align2" style="height: 141px;">最大料金<br>(繰り返し適用)</p>
          <p class="p-price_items_list_first_subTtl js-align3" style="height: 104px;">通常料金<br></p>
        </div>
      </li>
      <!-- 料金情報を動的に表示 -->
      <li v-for="(ryokin, index) in parkingInfo.ryokinData" :key="index" class="p-price_items_list js-price_items_list">
        <h4 class="p-price_items_list_ttl p-price_items_list_ttl--type2 js-align1" style="height: 54px;">
          {{ ryokin.taisyoname1 || '全日' }}
        </h4>
        <div class="p-price_items_list_wrap">
          <h5 class="p-price_items_list_subTtl">最大料金<br>(繰り返し適用)</h5>
          <p class="p-price_items_list_txt js-align2" style="height: 141px;">
            {{ ryokin.maxprice_desc1 || '情報がありません' }}
          </p>
          <h5 class="p-price_items_list_subTtl">通常料金<br></h5>
          <p class="p-price_items_list_txt js-align3" style="height: 104px;">
            {{ ryokin.normalprice_desc1 || '情報がありません' }}
          </p>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>料金情報がありません。</p>
  </div>
</template>


<script>
export default {
  name: "SidebarComponent",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    parkingInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      ryokinData: [], // 料金データ
    };
  },
  methods: {
    async fetchRyokinData() {
      try {
        const response = await fetch(`/api/getRyokin?parkcd=${this.parkingInfo.parkcd}`);
        if (response.ok) {
          this.ryokinData = await response.json();
        } else {
          console.error("Failed to fetch ryokin data");
        }
      } catch (error) {
        console.error("Error fetching ryokin data:", error);
      }
    },
    closeSidebar() {
      this.$emit("close-sidebar");
    },
  },
};
</script>

<style>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  background-color:rgb(215, 148, 34);
  border-right: 1px solid #ccc;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  z-index: 1000;

}

.sidebar.hidden {
  display: none; /* サイドバーを非表示にする場合 */
}

</style>


