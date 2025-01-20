<template>
  <header>
    <div>
      <label>
        <input type="checkbox" v-model="filters.ryokin" @change="emitFilter" />
        他社料金変更あり
      </label>
      <select v-if="fales" v-model="filters.company" @change="emitFilter">
        <option :value="null">すべて</option>
        <option :value="1">タイムズ</option>
        <option :value="0">名鉄協商</option>
      </select>

      <button @click="$emit('exportCsv')">CSV出力</button>

    </div>
    <div>
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="駐車場名またはコードを入力" 
      />
      <button @click="emitSearch">移動</button>
    </div>

    <div>
      <label>期間:</label>
      <input type="date" v-model="period.start" @change="emitPeriod" />
      <input type="date" v-model="period.end" @change="emitPeriod" />
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      filters: { company: null, ryokin: false },
      period: { start: null, end: null },
    };
  },
  methods: {
    emitFilter() {
      this.$emit("filterChanged", this.filters);
    },
    emitPeriod() {
      this.$emit("periodChanged", this.period);
    },
    emitSearch() {
      this.$emit("searchParking", this.searchTerm); // 検索文字列を親に送信
    },

  },//methods 
};
</script>

<style>
header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
}
</style>
