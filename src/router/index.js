import { createRouter, createWebHashHistory } from "vue-router";

import home from "../views/home.vue";



const router = createRouter({
    history: createWebHashHistory(),
    routes: [

        {
            path: "/",
            component: home,
            name: 'home',
        }
    ]
});
export default router;