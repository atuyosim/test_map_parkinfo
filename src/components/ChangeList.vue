<template>
  <div class="change-list-container">
    <h2>変更リスト</h2>
    <table class="change-list-table">
      <thead>
        <tr>
          <th>距離 (m)</th>
          <th>駐車場CD</th>
          <th>駐車場名</th>
          <th>料金</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedChangeList" :key="index">
          <!-- 上段（協商のデータ） -->
          <td rowspan="2">{{ item.distance }}</td>
          <td><a :href="item.meitetsu.url" target="_blank">{{ item.meitetsu.parkcd }}</a></td>
          <td>{{ item.meitetsu.parkname }}</td>
          <td>{{ item.meitetsu.ryokin }}円</td>
        </tr>
        <tr>
          <!-- 下段（他社のデータ） -->
          <td><a :href="item.other.url" target="_blank">{{ item.other.parkcd }}</a></td>
          <td>{{ item.other.parkname }}</td>
          <td>{{ item.other.ryokin }}円</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeList: [], // 変更データ
    };
  },
  computed: {
    sortedChangeList() {
      return this.changeList.sort((a, b) => a.distance - b.distance);
    },
  },
  async mounted() {
    try {
      const response = await fetch("/api/getParkingData");
      const data = await response.json();

      const filteredData = data.filter((d) => d.ryokin === 1);
      const meitetsuData = data.filter((d) => d.company === 0);

      const list = [];

      filteredData.forEach((baseData) => {
        const basePosition = new google.maps.LatLng(baseData.緯度, baseData.経度);

        meitetsuData.forEach((meitetsu) => {
          const meitetsuPosition = new google.maps.LatLng(meitetsu.緯度, meitetsu.経度);
          const dis = google.maps.geometry.spherical.computeDistanceBetween(basePosition, meitetsuPosition);

          if (dis <= 1000) {
            list.push({
              distance: Math.round(dis),
              meitetsu: {
                parkcd: meitetsu.parkcd,
                parkname: meitetsu.駐車場名,
                url: meitetsu.URL,
                ryokin: meitetsu.ryokin,
              },
              other: {
                parkcd: baseData.parkcd,
                parkname: baseData.駐車場名,
                url: baseData.URL,
                ryokin: baseData.ryokin,
              },
            });
          }
        });
      });

      this.changeList = list;
    } catch (error) {
      console.error("変更リストのデータ取得に失敗:", error);
    }
  },
};
</script>

<style>
.change-list-container {
  padding: 20px;
}

.change-list-table {
  width: 100%;
  border-collapse: collapse;
}

.change-list-table th,
.change-list-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.change-list-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}
</style>
