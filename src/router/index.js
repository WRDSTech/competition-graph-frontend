import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import { component } from 'vue/types/umd'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/company-graph/:graphType',
    name: 'CompanyGraph',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "companyGraph" */ '../views/CompanyRelations.vue')
  },
  {
    path: '/search-company',
    name: 'SearchPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "searchPage" */ '../views/SearchPageForm.vue')
  },
  {
    path: '/partial-graph/:id/:layers/:comp/:prod/:other/:unkown',
    name: 'ParitalGraph',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "searchPage" */ '../views/PartialRelations.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
