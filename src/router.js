import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';
import Home from './views/Home.vue';

Vue.use(VueRouter);

const metaAuth = { requiresAuth: true };

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/login',
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: metaAuth,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login.vue'),
    },
    {
      path: '/about',
      name: 'about',
      meta: metaAuth,
      // meta: { requiresAuth: auth },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (!requiresAuth) {
    next();
  }

  firebase.auth().onAuthStateChanged((currentUser) => {
    if (requiresAuth && !currentUser) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      if (to.name === 'login') {
        next({ name: 'home' });
      }
      next();
    }
  });
});

export default router;
