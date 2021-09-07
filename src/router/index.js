import Vue from 'vue';
import VueRouter from 'vue-router';
import goTo from 'vuetify/lib/services/goto';
import generateGlaChildren from './generateGlaChildren';

Vue.use(VueRouter);

const routes = [
  {
    path: '/demo-report/:id',
    component: () => import(/* webpackChunkName: "gla" */ '../views/gla/GLAMain.vue'),
    children: generateGlaChildren('gla'),
  },
  {
    path: '/public/gla-report/:id',
    name: 'publicGLAReport',
    component: () => import(/* webpackChunkName: "gla" */ '../views/gla/PublicGLA.vue'),
    meta: { requiresAuth: false },
    children: generateGlaChildren('publicGla'),
  },
  {
    path: '/self-gla-report/:id',
    component: () => import(/* webpackChunkName: "gla" */ '../views/gla/GLAMain.vue'),
    props: { selfGla: true },
    children: generateGlaChildren('sla'),
  },
  {
    path: '/public/self-gla-report/:id',
    name: 'publicSLAReport',
    component: () => import(/* webpackChunkName: "gla" */ '../views/gla/PublicGLA.vue'),
    meta: { requiresAuth: false },
    props: { selfGla: true },
    children: generateGlaChildren('publicSla'),
  },
  {
    path: '/super-gla-report',
    name: 'superGLAReport',
    component: () => import(/* webpackChunkName: "gla" */ '../views/gla/GLAMain.vue'),
  },
  {
    path: '/group-gla-report/:id',
    name: 'groupGLAReport',
    component: () => import(/* webpackChunkName: "gla" */ '../views/gla/GLAMain.vue'),
  },
  {
    path: '/group-sla-report/:id',
    name: 'groupSLAReport',
    props: { selfGla: true },
    component: () => import(/* webpackChunkName: "gla" */ '../views/gla/GLAMain.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "public" */ '../views/404.vue'),
    meta: { requiresAuth: false },
  },
  { path: '*', redirect: '/demo-report/1/', hidden: true },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0;
    const scrollOption = {
      duration: 150,
      offset: 0,
      easing: 'easeInOutCubic',
    };

    if (to.hash) {
      scrollTo = to.hash;
    } else if (savedPosition) {
      scrollTo = savedPosition.y;
    }

    return goTo(scrollTo, scrollOption);
  },
  routes,
});

export default router;
