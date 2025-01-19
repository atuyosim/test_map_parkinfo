<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>

export default {
  name: "MapComponent",
  props: {
    filters: {
      type: Object,
      required: true,
    },
    onMarkerClick: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      map: null, // Google Maps インスタンス
      markers: [], // マーカーリスト
      parkingData: [], // 駐車場データ
    };
  },
  watch: {
    filters: {
      deep: true,
      handler: "updateMap",
    },
  },
  async mounted() {
    try {
      await this.loadGoogleMapsAPI(); // Google Maps API のロード
      await this.fetchParkingData(); // 駐車場データの取得
      this.initMap(); // 地図を初期化
      this.updateMap(); // マーカーを描画
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
    }
  },
  methods: {
    async loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined") {
          resolve(); // Google Maps API が既にロードされている場合
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
    async fetchParkingData() {
      try {
        const response = await fetch("/api/getParkingData");
        const data = await response.json();

        this.parkingData = data.map((parking) => ({
          parkname: parking.駐車場名,
          parkcd: parking.parkcd,
          getdate: parking.取得日,
          lat: parseFloat(parking.緯度),
          lng: parseFloat(parking.経度),
          url: parking.URL,
          ryokin: parking.ryokin,
          company: parking.company,
        }));
      } catch (error) {
        console.error("Failed to fetch parking data:", error);
      }
    },
    initMap() {
      const mapOptions = {
        center: { lat: 35.0, lng: 136.9 },
        zoom: 11,
      };
      this.map = new google.maps.Map(this.$refs.mapContainer, mapOptions);
    },
    updateMap() {
      // 既存のマーカーを削除
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];

      // アイコンの設定
      const icons = {
        0: "/res/pin_meitetsukyosho.png", // 名鉄協商アイコンのパス
        1: "/res/pin_times.png",   // タイムズアイコンのパス
      };

      // フィルタリングされた駐車場データを処理
      this.parkingData.forEach((data) => {
        if (this.filters && this.filters.ryokin && data.ryokin !== 1) return;
        //if (this.filters.company !== null && data.company !== this.filters.company) return;

        //console.log("filters.ryokin = " + this.filters.ryokin);
        //console.log("data.ryokin = " + data.ryokin);

        const marker = new google.maps.Marker({
          position: { lat: data.lat, lng: data.lng },
          map: this.map,
          title: data.parkname,
          icon: icons[data.company] || null,
        });

        marker.addListener("click", () => {
          this.onMarkerClick(data);
        });

        this.markers.push(marker);

      });
    },
  },
};
</script>

<style>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
