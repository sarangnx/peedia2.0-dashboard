
export default [
    {
        path: '/',
        redirect: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/layout/DashboardLayout'),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 1,
                    maxrank: 2
                },
            },
            {
                path: '/orders',
                name: 'orders',
                component: () => import(/* webpackChunkName: "orders" */ '@/views/Orders.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 1,
                    maxrank: 2
                },
            },
            {
                path: '/items',
                name: 'items',
                component: () => import(/* webpackChunkName: "items" */ '@/views/Items.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 2,
                    maxrank: 2,
                },
                redirect: '/items/view-item',
                children: [
                    {
                        path: 'add-item',
                        name: 'add-item',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/AddItem.vue'),
                    },
                    {
                        path: 'add-excel',
                        name: 'add-excel',
                        component: () => import(/* webpackChunkName: "items" */ '../views/Items/ItemTable.vue'),
                    },
                    {
                        path: 'view-items',
                        name: 'view-items',
                        component: () => import(/* webpackChunkName: "items" */ '@/views/ViewItems.vue'),
                    }
                ]
            },
            {
                path: '/category',
                name: 'category',
                component: () => import(/* webpackChunkName: "banner" */ '@/views/Category/Category.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 2,
                    maxrank: 2
                },
            },
            {
                path: '/notifications',
                name: 'notifications',
                component: () => import(/* webpackChunkName: "notifications" */ '@/views/Notifications.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 2,
                    maxrank: 4
                },
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import(/* webpackChunkName: "profile" */ '@/views/UserProfile.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 1,
                    maxrank: 4
                },
            },
            {
                path: '/users',
                name: 'users',
                component: () => import(/* webpackChunkName: "users" */ '@/views/Users.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 2,
                    maxrank: 4
                },
            },
        ]
    },
    {
        path: '/',
        redirect: 'login',
        component: () => import(/* webpackChunkName: "auth" */ '@/layout/AuthLayout'),
        children: [
            {
                path: '/login',
                name: 'login',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Login.vue')
            },
            {
                path: '/register',
                name: 'register',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Register.vue')
            }
        ]
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/Logout.vue'),
    },
]
