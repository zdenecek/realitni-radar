// Composables
import Listings from '@/views/Listings.vue';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    beforeEnter: function(to: any, _: any, next: any) {
      if (to.query.id) {
        next({ path: `inzerat/${to.query.id}` });
      } else {
        next();
      }
    },
    children: [
      {
        path: '',
        name: 'listings',
        component: Listings,
      },
      {
        path: '/mesta',
        name: 'listings-cities',
        component: () => import('@/views/Cities.vue'),
      },
      {
        path: '/o-radaru',
        name: 'about',
        component: () => import('@/views/About.vue'),
      },
      {
        path: '/inzerat/:id',
        name: 'listing',
        component: () => import('@/views/ListingDetail.vue'),
      },
      {
        path: '/listing/:id',
        beforeEnter: function(to: any, _: any, next: any) {
            next({ path: to.path.replace("listing", "inzerat") });
        },
        component: () => undefined
      }
    ],
  },
]



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
