<template>
  <div id="map"></div>
</template>

<script>
export default {
  props: ["parkingData"],
  watch: {
    parkingData: "updateMapMarkers",
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.6895, lng: 139.6917 },
        zoom: 10,
      });
    },
    updateMapMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = this.parkingData.map((parking) => {
        const iconPath =
          parking.company === 1
            ? "/res/pin_times.png"
            : "/res/pin_meitetsukyosho.png";
        const marker = new google.maps.Marker({
          position: { lat: parking.latitude, lng: parking.longitude },
          map: this.map,
          icon: iconPath,
          animation: google.maps.Animation.DROP,
        });
        marker.addListener("click", () => {
          this.$emit("markerClicked", parking);
        });
        return marker;
      });
    },
  },
  mounted() {
    this.initMap();
    this.updateMapMarkers();
  },
  data() {
    return {
      map: null,
      markers: [],
    };
  },
};
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}
</style>
