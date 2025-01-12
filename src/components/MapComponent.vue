<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
export default {
  name: "MapComponent",
  data() {
    return {
      map: null, // Google Maps オブジェクトを保持
    };
  },
  methods: {
    // Google Maps API を動的にロードする関数
    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        // Google Maps API がすでにロードされている場合は再ロードしない
        if (typeof google !== "undefined") {
          resolve();
          return;
        }

        // スクリプトタグを作成して API をロード
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;

        // スクリプトのロードが完了したら resolve
        script.onload = resolve;

        // スクリプトのロードエラー時に reject
        script.onerror = () => reject(new Error("Failed to load Google Maps API"));

        document.head.appendChild(script);
      });
    },
    // Google Maps を初期化する関数
    initMap() {
      const mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      };

      // マップを指定の要素に描画
      this.map = new google.maps.Map(this.$refs.mapContainer, mapOptions);
    },
  },
  async mounted() {
    // グローバルスコープにコールバック関数を登録
    window.initMap = this.initMap;

    try {
      // Google Maps API をロード
      await this.loadGoogleMapsAPI();

      // マップを初期化
      this.initMap();
    } catch (error) {
      console.error(error.message);
    }
  },
};
</script>

<style>
.map-container {
  width: 100%;
  height: 400px;
}
</style>
