import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '../store';

function lazyLoad(page) {
    return () =>
        import ( /* webpackChunkName: "[request]" */ `@/pages/${page}.vue`);
}

const routes = [{
        path: '/user',
        name: 'user',
        component: lazyLoad('Usuario')
    },
    {
        path: '/game',
        name: 'game',
        component: lazyLoad('Juego')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

Vue.use(VueRouter);

router.beforeEach((to, from, next) => {
    next();
});

export default router;