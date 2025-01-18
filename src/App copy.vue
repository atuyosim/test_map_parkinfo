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
      selectedParking: null,
      //selectedParking: {}, // 選択された駐車場の情報
    };
  },
  methods: {
    handleMarkerClick(parking) {
      // マーカークリック時にサイドバーを表示し、情報を設定

      console.log("handleMarkerClick called with:", parking);

      this.selectedParking = parking;
      this.isSidebarVisible = true;

      console.log("isSidebarVisible:", this.isSidebarVisible); 
    },
  },
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
