<template>
  <header class="custom-header">
    <div class="header-left">

    <button @click="toggleSettings" class="btn btn-secondary">距離?</button>

    <div v-if="showSettings" class="settings-panel">

      <label class="distance-label">
        <select v-model="distance" @change="emitDistance" class="form-select">
          <option :value="100">100m</option>
          <option :value="200">200m</option>
          <option :value="500">500m</option>
          <option :value="1000">1km</option>
        </select>
      </label>


    </div>

      <label class="checkbox-label">
        <input type="checkbox" v-model="filters.ryokin" @change="emitFilter" />
        他社の料金変更あり
      </label>

      <button @click="$emit('exportCsv')" class="btn btn-primary">CSV出力</button>
      <button @click="openChangeList" class="btn btn-warning">変更リスト</button>

    </div>
    <div class="header-right">
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="駐車場名またはコードを入力" 
        class="search-input"
      />
      <button @click="emitSearch" class="btn btn-success">移動</button>
    </div>

    <!-- ローディングアニメーション -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>データ取得中...</p>
    </div>

  </header>
</template>

<script>
export default {
  props: {
    stats: {
      type: Object,
      required: true, // 件数情報を親コンポーネントから受け取る
    },


  },

  data() {
    return {
      filters: { company: null, ryokin: false },
      period: { start: null, end: null },
      distance: 100, // デフォルトで100mを選択
      showSettings: false,
      isLoading: false, // ローディング状態
    };
  },
  methods: {
    emitFilter() {

      this.isLoading = true; // ローディング開始
      this.$emit("filterChanged", this.filters);

      // データ取得のシミュレーション（実際にはAPIからデータを取得する）
      setTimeout(() => {
        this.isLoading = false; // 取得完了でローディング終了
      }, 2000); // 2秒の遅延（実際のAPI取得時間に合わせる）


    },
    emitPeriod() {
      this.$emit("periodChanged", this.period);
    },
    emitSearch() {
      this.$emit("searchParking", this.searchTerm); // 検索文字列を親に送信
    },
    emitDistance() {
      this.$emit("distanceChanged", this.distance); // 距離変更イベントを発火
    },

    toggleSettings() {
      this.showSettings = !this.showSettings;
    },

    openChangeList() {
      //window.open("/change-list", "_blank", "width=800,height=600");
      const newWindow = window.open(
        window.location.origin + "/change-list", // ✅ フルURLで開く
        "_blank",
        "width=800,height=600"
      );
      if (newWindow) {
        newWindow.focus();
      } else {
        alert("ポップアップブロックが有効になっています。許可してください。");
      }




    },


  },//methods 
};
</script>

<style>
/*
header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
}
*/
/* ヘッダー全体のデザイン */
.custom-header {
  background-color: #343a40; /* ダークグレー */
  color: white;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* 左側の設定ボタンと設定エリア */
.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 設定エリアを横並びに */
.settings-panel {
  display: flex;
  align-items: center;
  gap: 15px;
}


/* チェックボックスとラベルのスタイル */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

/* 距離のセレクトボックス */
.distance-label {
  font-size: 14px;
}

/* セレクトボックスのスタイル */
.form-select {
  padding: 5px;
  border-radius: 5px;
  border: none;
}

/* 検索ボックス */
.search-input {
  padding: 8px;
  border-radius: 5px;
  border: none;
  width: 250px;
}

/* ボタンのデザイン */
.btn {
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease-in-out;
}

/* プライマリボタン（CSV出力） */
.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* サクセスボタン（移動） */
.btn-success {
  background-color: #28a745;
  color: white;
  border: none;
}

.btn-success:hover {
  background-color: #1e7e34;
}

/* 変更リストボタンのデザイン */
.btn-warning {
  background-color: #ffc107;
  color: #212529;
  border: none;
}

.btn-warning:hover {
  background-color: #e0a800;
}


/* ローディングオーバーレイ（全画面を覆う） start */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  z-index: 9999;
}

/* スピナー（円形のアニメーション） */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

/* スピナーのアニメーション */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* ローディングオーバーレイ（全画面を覆う） end */


</style>
