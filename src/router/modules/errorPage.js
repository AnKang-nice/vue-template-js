const errorPageRoutes = [

    // 500
    {
        path: '/500',
        component: () => import('@/pages/publicErrorPages/serverError.vue')
    },
    // 空页面
    {
        path: '/empty',
        component: () => import('@/pages/publicErrorPages/emptyPage.vue')
    },
    // 404
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/publicErrorPages/notFound.vue')
    },
]

export default errorPageRoutes