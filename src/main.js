import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Google Maps API を使用するプラグインをインポート
import VueGoogleMaps from '@fawmi/vue-google-maps';
// グローバルスタイルのインポート（必要に応じて）
import './assets/styles.css';

import router from "./router"; // 追加

const app = createApp(App);

// Google Maps API キーを設定
app.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
  },
});
app.use(router); // 追加
app.mount('#app');
