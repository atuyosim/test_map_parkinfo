<template>
  <div v-if="isVisible" class="sidebar">
    <button @click="closeSidebar">閉じる</button>
    <h2>{{ parkingInfo.name || "No Name" }}</h2>
    <p>緯度: {{ parkingInfo.lat }}</p>
    <p>経度: {{ parkingInfo.lng }}</p>
    <p>URL: <a :href="parkingInfo.url" target="_blank">{{ parkingInfo.url }}</a></p>
    <h3>料金情報</h3>
    <ul>
      <li v-for="(price, index) in ryokinData" :key="index">
        <p>取得日: {{ price.getinfodate }}</p>
        <p>最大料金: {{ price.maxprice_desc }} - {{ price.maxprice_detail }}</p>
        <p>通常料金: {{ price.normalprice_desc }} - {{ price.normalprice_detail }}</p>
      </li>
    </ul>
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
  background-color: #f4f4f4;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  z-index: 1000;

}

.sidebar.hidden {
  display: none; /* サイドバーを非表示にする場合 */
}

</style>
