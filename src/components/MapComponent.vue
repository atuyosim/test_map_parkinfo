<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
export default {
  name: "MapComponent",
  props: {
    onMarkerClick: {
      type: Function,
      required: true, // マーカークリック時のコールバック関数
    },
  },
  data() {
    return {
      map: null,
      markers: [],
      parkingData: [],
    };
  },
  methods: {
    async fetchParkingData() {
      try {
        const response = await fetch("/api/getParkingData");
        const data = await response.json();

        // プロパティ名を英語形式に変換し、不正データを除外
        this.parkingData = data
          .map((parking) => {
            return {
              name: parking.駐車場名,
              lat: parseFloat(parking.緯度),
              lng: parseFloat(parking.経度),
              url: parking.URL,
              fee: parking.ryokin,
              company: parking.company, // 会社区分
            };
          })
          .filter((parking) => {
            const isValid = !isNaN(parking.lat) && !isNaN(parking.lng);
            if (!isValid) {
              console.error(`Invalid parking data: ${JSON.stringify(parking)}`);
            }
            return isValid;
          });
      } catch (error) {
        console.error("Failed to fetch parking data:", error);
      }
    },
    initMap() {
      const mapOptions = {
        center: { lat: 35.0, lng: 136.9 },
        zoom: 10,
      };

      this.map = new google.maps.Map(this.$refs.mapContainer, mapOptions);

      // カスタムアイコンの定義
      const icons = {
        0: "/public/res/pin_meitetsukyosho.png", // 名鉄協商アイコンのパス
        1: "public/res/pin_times.png",   // タイムズアイコンのパス
      };

      // マーカーを作成
      this.parkingData.forEach((parking) => {
        const marker = new google.maps.Marker({
          position: { lat: parking.lat, lng: parking.lng },
          map: this.map,
          title: parking.name,
          icon: icons[parking.company] || null, // アイコンを設定
        });

        // マーカークリック時のイベント
        marker.addListener("click", () => {
          this.onMarkerClick(parking);
        });

        this.markers.push(marker);
      });
    },
    async loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined") {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
  },
  async mounted() {
    window.initMap = this.initMap;
    await this.fetchParkingData();
    await this.loadGoogleMapsAPI();
    this.initMap();
  },
};
</script>

<style>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
