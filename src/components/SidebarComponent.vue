<template>
  <div v-if="parkingInfo && parkingInfo.ryokinData && parkingInfo.ryokinData.length > 0" class="sidebar">
    <h2>{{ parkingInfo.parkname }}</h2>
    <a :href="parkingInfo.url" target="_blank">駐車場の詳細を見る</a>

    <!-- 駐車場の料金情報をテーブル形式で表示 -->
    <table class="parking-info-table">
      <thead>
        <tr>
          <th>対象名</th>
          <th>最大料金 (繰り返し適用)</th>
          <th>詳細</th>
          <th>通常料金</th>
          <th>詳細</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ryokin, index) in parkingInfo.ryokinData" :key="index">
          <td>{{ ryokin[`taisyoname${index + 1}`] || '全日' }}</td>
          <td>{{ ryokin[`maxprice_desc${index + 1}`] || '情報なし' }}</td>
          <td>{{ ryokin[`maxprice_detail${index + 1}`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_desc${index + 1}`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_detail${index + 1}`] || '情報なし' }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="closeSidebar">閉じる</button>
  </div>
  <div v-else class="sidebar">
    <p>料金情報がありません。</p>
    <button @click="closeSidebar">閉じる</button>
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

<style scoped>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%; /* サイドバーを画面幅の半分に設定 */
  height: 100vh;
  background-color: rgb(215, 148, 34);
  border-right: 1px solid #ccc;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
}

.parking-info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.parking-info-table th,
.parking-info-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.parking-info-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.parking-info-table tbody tr:nth-child(odd) {
  background-color: #fafafa;
}

.parking-info-table tbody tr:nth-child(even) {
  background-color: #ffffff;
}
</style>



