import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import routes from './routes';
import usergroups from './usergroups';

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

/**
 * This navigation gruad is used for restricting access
 * by rank of usergroup
 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.minrank || record.meta.maxrank)) {
        // find the matched record
        const record = to.matched.find(record => record.meta.minrank || record.meta.maxrank);
        // get info of current user
        const currentuser = store.getters.getUser;
        // get full details of current user's usergroup
        const currentusergroup = usergroups.find(item => currentuser.usergroup === item.id);

        const user = usergroups.find(item => item.id === 'user');
        const admin = usergroups.find(item => item.id === 'admin');
        if (
            currentusergroup.rank >= record.meta.minrank &&
            currentusergroup.rank <= record.meta.maxrank
        ) {
            next();
        } else if ( currentusergroup.rank === user.rank ) {
            next('/unauthorized');
        } else if ( currentusergroup.rank >= admin.rank ){
            next('/admin');
        } else {
            next('/dashboard');
        }
    } else {
        next();
    }
});

export default router;
