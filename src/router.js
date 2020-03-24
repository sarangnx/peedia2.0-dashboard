import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import DashboardLayout from '@/layout/DashboardLayout';
import AuthLayout from '@/layout/AuthLayout';
Vue.use(Router);

const router = new Router({
    linkExactActiveClass: 'active',
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: 'dashboard',
            component: DashboardLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/orders',
                    name: 'orders',
                    component: () => import(/* webpackChunkName: "orders" */ './views/Orders.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/items',
                    name: 'items',
                    component: () => import(/* webpackChunkName: "items" */ './views/Items.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/viewitems',
                    name: 'view-items',
                    component: () => import(/* webpackChunkName: "viewitems" */ './views/ViewItems.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/stocks',
                    name: 'stocks',
                    component: () => import(/* webpackChunkName: "stocks" */ './views/Stocks.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/offers',
                    name: 'offers',
                    component: () => import(/* webpackChunkName: "offers" */ './views/Offers.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/banner',
                    name: 'banner',
                    component: () => import(/* webpackChunkName: "banner" */ './views/Banner.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/notifications',
                    name: 'notifications',
                    component: () => import(/* webpackChunkName: "notifications" */ './views/Notifications.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import(/* webpackChunkName: "profile" */ './views/UserProfile.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import(/* webpackChunkName: "users" */ './views/Users.vue'),
                    meta: {
                        requiresAuth: true,
                    },
                },
            ]
        },
        {
            path: '/',
            redirect: 'login',
            component: AuthLayout,
            children: [
                {
                    path: '/login',
                    name: 'login',
                    component: () => import(/* webpackChunkName: "auth" */ './views/Login.vue')
                },
                {
                    path: '/register',
                    name: 'register',
                    component: () => import(/* webpackChunkName: "auth" */ './views/Register.vue')
                }
            ]
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import(/* webpackChunkName: "auth" */ '@/views/Logout.vue'),
        },
    ]
});

/**
 * This navigation gruad is used for restricting access
 * to routes requiring authentication.
 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            store.dispatch('checkExp').then((res) => {
                if (res && res.status === 'authenticated') {
                    next();
                } else {
                    next('/login');
                }
            });
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;
