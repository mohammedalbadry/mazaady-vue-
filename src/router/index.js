import Vue from 'vue'
import VueRouter from 'vue-router'
import FilterView from '../views/FilterView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'filter',
    component: FilterView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
