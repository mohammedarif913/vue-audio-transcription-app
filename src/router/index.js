import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/upload',
    name: 'FileUpload',
    component: () => import('@/views/FileUpload.vue')
  },
  {
    path: '/text',
    name: 'TextWorkspace',
    component: () => import('@/views/TextWorkspace.vue')
  },
  {
    path: '/audio',
    name: 'AudioWorkspace',
    component: () => import('@/views/AudioWorkspace.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
