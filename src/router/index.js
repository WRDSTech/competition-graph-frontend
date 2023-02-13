import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sample-form',
    name: 'SampleForm',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "sampleForm" */ '../views/SampleForm.vue')
  },
  {
    path: '/view-form/:ticker',
    name: 'FormReader',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "formReader" */ '../views/FormReader.vue')
  },
  {
    path: '/view-form',
    name: 'FormReaderByURL',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "formReaderByURL" */ '../views/FormReader.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
