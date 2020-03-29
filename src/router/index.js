import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import routes from './routes';

Vue.use(Router);

const router = new Router({
    linkExactActiveClass: 'active',
    mode: 'history',
    routes: [...routes]
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
