import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../behavior-container/behavior-container.vue')
        },
        {
            path: '/old',
            component: () => import('../editor/behavior-old.vue')
        }
    ]
})
export default router