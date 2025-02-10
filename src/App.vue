<template>
  <div id="app">
    <HeaderComponent
      @filterChanged = "handleFilterChange" 
      @exportCsv = "exportCsv"
      @searchParking="handleSearchParking"
      @distanceChanged="handleDistanceChange"
    />
    <div class="main-content">
      <!-- SidebarComponent -->
      <SidebarComponent 
        v-if="isSidebarVisible"
        :parkingInfo="selectedParking" 
        @close-sidebar="hideSidebar"
      />
      <!-- MapComponent -->
      <MapComponent 
        ref="mapComponent" 
        :filters="filters" 
        :distance="distance" 
        :onMarkerClick="handleMarkerClick" />
    </div>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import SidebarComponent from "./components/SidebarComponent.vue";
import MapComponent from "./components/MapComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    SidebarComponent,
    MapComponent,
  },
  data() {
    return {
      isSidebarVisible: false, // サイドバーの表示状態
      selectedParking: null,   // 選択された駐車場の情報

      filters: { ryokin: false }, // 必須プロパティを初期化
      distance: 100, // 初期値は100m
    };
  },

  methods: {
    async handleMarkerClick(marker) {
      console.log("handleMarkerClick called with:", marker);

      // サイドバーを表示
      this.isSidebarVisible = true;

      try {
        // APIを呼び出して料金情報を取得
        console.log("marker.parkcd = " + marker.parkcd);
        const response = await fetch(`/api/getRyokin?parkcd=${marker.parkcd}`);
        const ryokinData = await response.json();

        console.log("ryokinData = ", ryokinData);

        // サイドバー表示用データを設定
        this.selectedParking = {  // selectedParking に統一
          ...marker,
          ryokinData: ryokinData, // APIからの料金情報を追加
        };

      } catch (error) {
        console.error("料金情報の取得に失敗しました:", error);
      }
    },
    async hideSidebar() {
      console.log('close-sidebar event received'); // イベントが受信されたことを確認
      this.isSidebarVisible = false;
    },
    async handleFilterChange(newFilters) {
      console.log('called handleFiterChange');
      this.filters = newFilters; // フィルタを更新
    },

    async handleDistanceChange(newDistance) {
      this.distance = newDistance; // 距離を更新
    },

    exportCsv() {

      //this.$refs.mapComponent.exportCsv(); // MapComponent にCSV出力を指示
      if (this.$refs.mapComponent) {
        this.$refs.mapComponent.exportCsv(); // MapComponent のメソッドを呼び出し
      } else {
        console.error("MapComponent is not properly referenced.");
      }

    },//exportCsv

    handleSearchParking(searchTerm) {
      this.$refs.mapComponent.searchAndCenter(searchTerm); // MapComponent に検索とセンター移動を指示
    },//handleSearchParking


  } //methods

}; //export Default

</script>

<style>
#app {
  font-family: Arial, sans-serif;
}

.main-content {
  display: flex;
  position: relative;
}
</style>
