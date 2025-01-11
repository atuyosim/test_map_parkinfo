<template>
  <div id="app">
    <HeaderComponent
      @filterChanged="updateFilters"
      @periodChanged="updatePeriod"
    />
    <MapComponent
      :parkingData="filteredParkingData"
      @markerClicked="handleMarkerClick"
    />
    <SidebarComponent :details="selectedParking" v-if="selectedParking" />
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import MapComponent from "./components/MapComponent.vue";
import SidebarComponent from "./components/SidebarComponent.vue";

export default {
  data() {
    return {
      parkingData: [],
      filteredParkingData: [],
      selectedParking: null,
      filters: { company: null, ryokin: false },
      period: { start: null, end: null },
    };
  },
  methods: {
    async fetchParkingData() {
      const response = await fetch("/api/getParkingData");
      this.parkingData = await response.json();
      this.filteredParkingData = [...this.parkingData];
    },
    updateFilters(filters) {
      this.filters = filters;
      this.applyFilters();
    },
    updatePeriod(period) {
      this.period = period;
      this.applyFilters();
    },
    applyFilters() {
      this.filteredParkingData = this.parkingData.filter((item) => {
        if (this.filters.ryokin && item.ryokin !== 1) return false;
        if (this.filters.company && item.company !== this.filters.company)
          return false;
        return true;
      });
    },
    handleMarkerClick(parking) {
      this.selectedParking = parking;
    },
  },
  mounted() {
    this.fetchParkingData();
  },
};
</script>

<style>
/* 必要に応じてスタイルを記述 */
</style>
