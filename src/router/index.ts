import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [

        {
            path: '/',
            component: () => import('../editor-next/behavior3-vue.vue')
        }
    ]
})
export default router