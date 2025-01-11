<template>
  <header>
    <div>
      <label>
        <input type="checkbox" v-model="filters.ryokin" @change="emitFilter" />
        料金変更あり
      </label>
      <select v-model="filters.company" @change="emitFilter">
        <option :value="null">すべて</option>
        <option :value="1">タイムズ</option>
        <option :value="0">名鉄協商</option>
      </select>
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
  },
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
