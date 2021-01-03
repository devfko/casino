import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

function lazyLoad(page) {
    return () =>
        import ( /* webpackChunkName: "[request]" */ `@/pages/${page}.vue`);
}

const routes = [{
        path: '/',
        name: 'home',
        component: lazyLoad('Home')
    },
    {
        path: '/user',
        name: 'user',
        component: lazyLoad('Usuario')
    },
    {
        path: '/game',
        name: 'game',
        component: lazyLoad('Juego'),
        meta: { requiredAuth: true }
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

Vue.use(VueRouter);

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiredAuth)) {
        if (!store.state.userLogged) {
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;