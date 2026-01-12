import { createRouter, createWebHashHistory } from 'vue-router'
import errorPageRoutes from './modules/errorPage'
import publicRoutes from './modules/public'
const routes = [
    {
        path: '/',
        component: () => import('@/pages/home/index.vue')
    },
    ...publicRoutes,
    ...errorPageRoutes
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    console.log(to, from)
    if (to.path === '/login') {
        next()
    } else {
        // 如果用户没有登录，则跳转到登录页面
        if (!localStorage.getItem('token')) {
            console.log('没有登录')
            next('/login')
        } else {
            next()
        }
    }
})

export default router