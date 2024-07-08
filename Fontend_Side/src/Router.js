import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./components/HomePage.vue";
import ResultPage from "./components/ResultPage.vue";
import FailurePage from "./components/FailurePage.vue";

const routes = [
	{
		path: "/",
		name: "HomePage",
		component: HomePage,
	},
	{
		path: "/result/:order_id",
		name: "ResultPage",
		component: ResultPage,
	},
	{
		path: "/failure",
		name: "FailurePage",
		component: FailurePage,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
