<template>
  <div id="app">
    <HeaderComponent />
    <div class="main-content">
      <!-- SidebarComponent -->
      <SidebarComponent 
        :isVisible="isSidebarVisible" 
        :parkingInfo="selectedParking" 
        @close-sidebar="isSidebarVisible = false"
      />
      <!-- MapComponent -->
      <MapComponent :onMarkerClick="handleMarkerClick" />
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
    }
  }
};
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
