
export default [
    {
        path: '/',
        redirect: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/layout/DashboardLayout'),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard/Dashboard.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 1,
                    maxrank: 2
                },
            },
            {
                path: '/admin',
                name: 'admin dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard/AdminDashboard.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 3,
                    maxrank: 4
                },
            },
            {
                path: '/orders',
                name: 'orders',
                component: () => import(/* webpackChunkName: "orders" */ '@/views/Orders/Orders.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 1,
                    maxrank: 4
                },
            },
            {
                path: '/items',
                name: 'items',
                component: () => import(/* webpackChunkName: "items" */ '@/views/Items/Items.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 2,
                    maxrank: 4,
                },
                redirect: '/items/view-items',
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
                        component: () => import(/* webpackChunkName: "items" */ '@/views/Items/ViewItems.vue'),
                    }
                ]
            },
            {
                path: '/category',
                name: 'category',
                component: () => import(/* webpackChunkName: "category" */ '@/views/Category/Category.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 2,
                    maxrank: 2
                },
            },
            {
                path: '/notifications',
                name: 'notifications',
                component: () => import(/* webpackChunkName: "notifications" */ '@/views/Notifications/Notifications.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 2,
                    maxrank: 4
                },
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import(/* webpackChunkName: "profile" */ '@/views/Users/UserProfile.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 1,
                    maxrank: 4
                },
            },
            {
                path: '/localbody',
                name: 'localbody',
                component: () => import(/* webpackChunkName: "localbody" */ '@/views/Localbody/Localbody.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 3,
                    maxrank: 4
                },
            },
            {
                path: '/ration',
                name: 'ration',
                component: () => import(/* webpackChunkName: "ration" */ '@/views/Ration/Ration.vue'),
                meta: {
                    requiresAuth: true,
                    minrank: 1,
                    maxrank: 2
                },
            },
            {
                path: '/users',
                name: 'users',
                component: () => import(/* webpackChunkName: "users" */ '@/views/Users/Users.vue'),
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
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue')
            },
            {
                path: '/register',
                name: 'register',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Register.vue')
            },
            {
                path: '/reset',
                name: 'reset password',
                component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Reset.vue')
            }
        ]
    },
    {
        path: '/logout',
        name: 'logout',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth/Logout.vue'),
    },
]
