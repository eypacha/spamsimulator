import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import HomeScreen from '../views/HomeScreen.vue'

const routes = [
  {
    path: '/',
    name: 'HomeScreen',
    component: HomeScreen
  },
  {
    path: '/game',
    name: 'GameView',
    component: GameView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
