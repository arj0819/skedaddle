import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ErrorPage from '../views/ErrorPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
      path: '*',
      component: ErrorPage
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
