<template>
  <div v-if=" parkingInfo && parkingInfo.ryokinData && parkingInfo.ryokinData.length > 0" class="sidebar">

    <button class="close-button btn btn-outline-secondary btn-sm" @click="closeSidebar">閉じる</button>
    <h2>
        <a :href="parkingInfo.url" target="_blank">{{ parkingInfo.parkname }}</a>
    </h2>

    <!-- 駐車場の料金情報をテーブル形式で表示 -->
     <div v-for="(ryokin, index) in parkingInfo.ryokinData" :key="index" class="ryokin-section">
      <h3>取得日: {{ formatDate(ryokin.getinfodate) }} 【{{ parkingInfo.parkcd }}】</h3>
      <table class="parking-info-table">
        <thead>
          <tr>
            <th>適用  </th>
            <th colspan=2>最大料金</th>
            <th colspan=2>通常料金</th>
          </tr>
        </thead>
        <tbody>

<!--
 v-for v-ifだとなぜかうまくいかないので
        <tr v-for="i in 5" :key="i"  v-if="ryokin && i > '0' ">
          <td>{{ ryokin[`taisyoname${i}`]  || '情報なし' }} </td>
          <td>{{ ryokin[`maxprice_desc${i}`] || '情報なし' }}</td>
          <td>{{ ryokin[`maxprice_detail${i}`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_desc${i}`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_detail${i}`] || '情報なし' }}</td>
        </tr>
-->
        <tr v-if="ryokin[`taisyoname1`] ">
          <td>{{ ryokin[`taisyoname1`]  || '情報なし' }} </td>
          <td>{{ ryokin[`maxprice_desc1`] || '情報なし' }}</td>
          <td>{{ ryokin[`maxprice_detail1`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_desc1`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_detail1`] || '情報なし' }}</td>
        </tr>
        <tr v-if="ryokin[`taisyoname2`] ">
          <td>{{ ryokin[`taisyoname2`]  || '情報なし' }} </td>
          <td>{{ ryokin[`maxprice_desc2`] || '情報なし' }}</td>
          <td>{{ ryokin[`maxprice_detail2`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_desc2`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_detail2`] || '情報なし' }}</td>
        </tr>
        <tr v-if="ryokin[`taisyoname3`] ">
          <td>{{ ryokin[`taisyoname3`]  || '情報なし' }} </td>
          <td>{{ ryokin[`maxprice_desc3`] || '情報なし' }}</td>
          <td>{{ ryokin[`maxprice_detail3`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_desc3`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_detail3`] || '情報なし' }}</td>
        </tr>
        <tr v-if="ryokin[`taisyoname4`] ">
          <td>{{ ryokin[`taisyoname4`]  || '情報なし' }} </td>
          <td>{{ ryokin[`maxprice_desc4`] || '情報なし' }}</td>
          <td>{{ ryokin[`maxprice_detail4`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_desc4`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_detail4`] || '情報なし' }}</td>
        </tr>
        <tr v-if="ryokin[`taisyoname5`] ">
          <td>{{ ryokin[`taisyoname5`]  || '情報なし' }} </td>
          <td>{{ ryokin[`maxprice_desc5`] || '情報なし' }}</td>
          <td>{{ ryokin[`maxprice_detail5`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_desc5`] || '情報なし' }}</td>
          <td>{{ ryokin[`normalprice_detail5`] || '情報なし' }}</td>
        </tr>


        </tbody>
      </table>
    </div>

  </div>

  <!--
  <div v-else class="sidebar">
    <p>料金情報がありません。</p>
    <button @click="closeSidebar">閉じる</button>
  </div>
  -->
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
      console.log('close-sidebar event emitted'); // イベントが発火されたことを確認
      this.$emit("close-sidebar");
    },
    formatDate(dateString) {
      if (!dateString || dateString.length !== 8) return "情報なし";

      // yyyy, MM, dd を分割
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);

      return `${year}/${month}/${day}`;
    }

  },
};
</script>

<style scoped>
.sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 45%; /* サイドバーを画面幅の半分に設定 */
  height: 100vh;
  opacity: 95%;
  background-color: rgb(149, 230, 152);
  border-right: 1px solid #ccc;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
}

/* 取得日のフォントサイズを1段階小さくする */
div.ryokin-section h3 {
  font-size: 0.9em; /* 通常のサイズより少し小さく */
}

/* 駐車場名称のフォントサイズを2段階小さくする */
.sidebar h2 {
  font-size: 1.2em; /* 2段階小さく */
}


:deep(.parking-info-table thead) {
  background-color: rgb(93, 94, 92);
  color: black;
  font-weight: bold;
}


.close-button{
    position: absolute;
    right: 0;
    top: 2%;
    transform: translateY(-50%);

    background-color:rgb(17, 190, 141);  /* 赤系の閉じるボタン */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease-in-out;
}
.close-button:hover {
  background-color:rgb(4, 39, 152); /* ホバー時の色変更 */
}


.parking-info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

div.ryokin-section h3{
  margin-top:20px;
  margin-bottom:0px;
}
div.ryokin-section .parking-info-table{
  margin-top:3px;
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



