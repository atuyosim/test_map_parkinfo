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

        // データを整形
        this.parkingData = data.map((parking) => ({
          parkname: parking.駐車場名,
          parkcd:parking.parkcd,
          lat: parseFloat(parking.緯度),
          lng: parseFloat(parking.経度),
          url: parking.URL,
          fee: parking.ryokin,
          company: parking.company, // アイコン切り替えに必要な会社情報
        }));
      } catch (error) {
        console.error("Failed to fetch parking data:", error);
      }
    },
    async loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined") {
          resolve(); // Google Maps API が既にロードされている場合
          return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
        script.async = true; // 非同期ロード
        script.defer = true; // 順序保証
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
    initMap() {
      const mapOptions = {
        center: { lat: 35.0, lng: 136.9 },
        zoom: 10,
      };

      this.map = new google.maps.Map(this.$refs.mapContainer, mapOptions);

      // アイコンの設定
      const icons = {
        0: "/res/pin_meitetsukyosho.png", // 名鉄協商アイコンのパス
        1: "/res/pin_times.png",   // タイムズアイコンのパス
      };

      // マーカーの作成
      this.parkingData.forEach((parking) => {
        const marker = new google.maps.Marker({
          position: { lat: parking.lat, lng: parking.lng },
          map: this.map,
          title: parking.name,
          icon: icons[parking.company] || null, // アイコンを設定
        });

        // マーカークリック時のイベント
        marker.addListener("click", () => {
          console.log('click start');
          this.onMarkerClick(parking); // SidebarComponent を表示
          console.log('click end');

        });

        this.markers.push(marker);
      });
    },
  },
  async mounted() {
    try {
      await this.loadGoogleMapsAPI(); // Google Maps API のロード
      await this.fetchParkingData(); // 駐車場データの取得
      this.initMap(); // 地図の初期化
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
    }
  },
};
</script>

<style>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
