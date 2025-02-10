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
    distance: {
      type: Number,
      required: true, // 距離を受け取る
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

      //  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}&libraries=geometry`;

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
        zoom: 10,
        zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER, // ズームコントロールを左中央に配置
        },
      };
      this.map = new google.maps.Map(this.$refs.mapContainer, mapOptions);
    },
    updateMap() {
            // 既存のマーカーを削除
            this.markers.forEach((marker) => marker.setMap(null));
            this.markers = [];

            // アイコンの設定
            const icons = {
              0: "/res/pin_meitetsukyosho.png", // 名鉄協商アイコン
              1: "/res/pin_times.png",          // タイムズアイコン
            };

            if(this.filters){
              console.log('this.filters = ' + this.filters);
              if(this.filters.ryokin){
                console.log('this.filters.ryokin = ' + this.filters.ryokin);
                
              }
            }

            if (this.filters && this.filters.ryokin  ) {

              // 「変更あり」: `ryokin=1` を基準に協商アイコンを描画
              const ryokinFilteredData = this.parkingData.filter((data) => data.ryokin === 1);
              const meitetsuData = this.parkingData.filter((data) => data.company === 0);

              ryokinFilteredData.forEach((baseData) => {
                // 基準データのマーカーを表示
                const marker = new google.maps.Marker({
                  position: { lat: baseData.lat, lng: baseData.lng },
                  map: this.map,
                  title: baseData.parkname,
                  icon: icons[1], // タイムズのアイコン
                });

                marker.addListener("click", () => {
                  this.onMarkerClick(baseData);
                });

                this.markers.push(marker);

                // 半径 100m 内にある協商アイコンを探索
                meitetsuData.forEach((meitetsu) => {
                  const basePosition = new google.maps.LatLng(baseData.lat, baseData.lng);
                  const meitetsuPosition = new google.maps.LatLng(meitetsu.lat, meitetsu.lng);

                  const dis = google.maps.geometry.spherical.computeDistanceBetween(basePosition, meitetsuPosition);

                  if (dis <= this.distance) {
                    // 協商データのマーカーを表示
                    const meitetsuMarker = new google.maps.Marker({
                      position: { lat: meitetsu.lat, lng: meitetsu.lng },
                      map: this.map,
                      title: meitetsu.parkname,
                      icon: icons[0], // 名鉄協商のアイコン
                    });

                    meitetsuMarker.addListener("click", () => {
                      this.onMarkerClick(meitetsu);
                    });

                    this.markers.push(meitetsuMarker);
                  }
                });
              });


            } else {

              // 「変更なし」: すべてのデータを描画
              this.parkingData.forEach((data) => {
                const marker = new google.maps.Marker({
                  position: { lat: data.lat, lng: data.lng },
                  map: this.map,
                  title: data.parkname,
                  icon: icons[data.company] || null, // アイコンを設定
                });

                marker.addListener("click", () => {
                  this.onMarkerClick(data);
                });

                this.markers.push(marker);

                });
              
            }//if 

    },//updateMap
    async exportCsv() {
    const filteredData = this.parkingData.filter((data) => data.ryokin === 1);
    const meitetsuData = this.parkingData.filter((data) => data.company === 0);
    const csvRows = [["parkcd,parkname,url,times_parkname,times_url"]]; // ヘッダー行

    // 100m以内の協商データを探索
    filteredData.forEach((baseData) => {
      const basePosition = new google.maps.LatLng(baseData.lat, baseData.lng);

      meitetsuData.forEach((meitetsu) => {
        const meitetsuPosition = new google.maps.LatLng(meitetsu.lat, meitetsu.lng);
        const dis = google.maps.geometry.spherical.computeDistanceBetween(basePosition, meitetsuPosition);

        if (dis <= this.distance) {
          csvRows.push([
            meitetsu.parkcd,
            meitetsu.parkname,
            meitetsu.url,
            baseData.parkname,
            baseData.url,
          ].join(","));
        }
      });
    });

    // CSVデータを文字列に変換
    const csvString = csvRows.join("\n");

        // BOM を追加
    const bom = "\uFEFF"; // UTF-8 BOM
    const csvWithBom = bom + csvString;

     // 現在の日時を取得してフォーマット
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 15); // YYYYMMDDHHMMSS 形式に変換

    const CSVfilename = `meitetsu_within_changed_${formattedDate}.csv`; // ファイル名を生成

    // ダウンロード用リンクを作成
    const blob = new Blob([csvWithBom], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = CSVfilename;
    a.click();
    URL.revokeObjectURL(url);

  },//exportCsv

  searchAndCenter(searchTerm) {
    if (!searchTerm) {
      console.warn("検索文字列が空です");
      return;
    }

    // 検索文字列でフィルタリング
    const matchingParking = this.parkingData.find((data) => {
      return (
        data.parkcd.includes(searchTerm) || 
        data.parkname.includes(searchTerm)
      );
    });

    if (!matchingParking) {
      alert("一致する駐車場が見つかりませんでした");
      return;
    }

    // 地図の中心を更新
    this.map.setCenter({ lat: matchingParking.lat, lng: matchingParking.lng });
    this.map.setZoom(15); // 必要に応じてズームレベルを調整
  }, //searchAndCenter



  }, //method 
}; //export Default
</script>

<style>
.map-container {
  width: 100%;
  height: 90vh;
}
</style>
