import { createRouter, createWebHistory } from "vue-router";
import ChangeList from "./components/ChangeList.vue";

const routes = [
  { path: "/change-list", component: ChangeList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
