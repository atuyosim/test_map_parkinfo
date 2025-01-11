<template>
  <div id="app">
    <HeaderComponent />
    <div class="main-content">
      <SidebarComponent />
      <MapComponent />
    </div>
  </div>
</template>

<script>
// 必要なコンポーネントをインポート
import HeaderComponent from "./components/HeaderComponent.vue";
import MapComponent from "./components/MapComponent.vue";
import SidebarComponent from "./components/SidebarComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    MapComponent,
    SidebarComponent,
  },
};
</script>

<style>
/* アプリ全体の基本スタイル */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
}

.main-content {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 60px); /* ヘッダーを除いた高さ */
}

/* 各コンポーネントのスタイル調整 */
HeaderComponent {
  height: 60px;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

SidebarComponent {
  width: 250px;
  background-color: #f4f4f4;
  border-right: 1px solid #ccc;
  padding: 10px;
}

MapComponent {
  flex: 1;
  background-color: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
