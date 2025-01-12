<template>
  <div v-if="isVisible" class="sidebar">
    <h2>{{ parkingInfo.name || "No Name" }}</h2>
    <p>
      <a :href="parkingInfo.url" target="_blank" rel="noopener noreferrer">
        詳細を見る
      </a>
    </p>
    <div v-if="parkingInfo.fee">
      <h3>料金情報</h3>
      <p>{{ parkingInfo.fee }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarComponent",
  props: {
    isVisible: {
      type: Boolean,
      required: true, // 表示/非表示を制御
    },
    parkingInfo: {
      type: Object,
      default: () => ({}), // 駐車場情報
    },
  },
};
</script>

<style>
.sidebar {
  padding: 10px;
  background-color: #f4f4f4;
  width: 250px;
  border-right: 1px solid #ccc;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
</style>
