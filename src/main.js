import { createApp } from 'vue';
import App from './App.vue';

// Google Maps API を使用するプラグインをインポート
import VueGoogleMaps from '@fawmi/vue-google-maps';

// グローバルスタイルのインポート（必要に応じて）
import './assets/styles.css';

const app = createApp(App);

// Google Maps API キーを設定
app.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
  },
});

app.mount('#app');
