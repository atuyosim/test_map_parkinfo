<template>
  <div>
    <h2>Sidebar</h2>
    <p>{{ companyName || 'No Company Name Provided' }}</p>
  </div>
</template>

<script>
export default {
  name: 'SidebarComponent',
  props: {
    companyName: {
      type: String,
      required: false,
      default: '', // デフォルト値
    },
  },
};
</script>

<style>
/* 必要に応じてスタイルを追加 */
</style>
