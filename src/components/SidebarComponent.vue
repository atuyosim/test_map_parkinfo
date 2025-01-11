<template>
  <aside>
    <h2>{{ details.companyName }} - {{ details.parkName }}</h2>
    <p><strong>住所:</strong> {{ details.address }}</p>
    <p><strong>料金詳細:</strong> {{ details.ryokin }}</p>
    <a :href="details.url" target="_blank">詳細を見る</a>
  </aside>
</template>

<script>
export default {
  props: ["details"],
};
</script>

<style>
aside {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}
</style>
