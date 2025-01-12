<template>
  <div v-if="isVisible" class="sidebar">
    <h2>{{ parkingInfo.name || "No Name" }}</h2>
    <p>緯度: {{ parkingInfo.lat }}</p>
    <p>経度: {{ parkingInfo.lng }}</p>
    <p>URL: <a :href="parkingInfo.url">{{ parkingInfo.url }}</a></p>
    <p v-if="parkingInfo.fee">料金: {{ parkingInfo.fee }}</p>
   </div>
   <div v-else>
    <p>Sidebar is hidden. isVisible: {{ isVisible }}</p> <!-- ログ -->
  </div>
</template>

<script>
export default {
  name: "SidebarComponent",
  props: {
    isVisible: {
      type: Boolean,
      required: true, // サイドバーの表示状態を制御
    },
    parkingInfo: {
      type: Object,
      default: () => ({}), // 駐車場情報
    },
    
  },
  watch: {
    parkingInfo(newVal) {
      console.log("Sidebar updated with:", newVal); // デバッグログ
    },

  },

};
</script>

<style>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  background-color: #f4f4f4;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar.hidden {
  display: none; /* サイドバーを非表示にする場合 */
}
</style>

