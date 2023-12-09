// Composables
import { useAuthStore } from '@/stores/auth';
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
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/inzeraty',
        name: 'listings',
        component: Listings,
        meta: {
          loggedIn: true
        }
      },
      {
        path: '/mesta',
        name: 'listings-cities',
        component: () => import('@/views/Cities.vue'),
        meta: {
          loggedIn: true
        }
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
        meta: {
          loggedIn: true
        }
      },
      {
        path: '/listing/:id',
        beforeEnter: function(to: any, _: any, next: any) {
            next({ path: to.path.replace("listing", "inzerat") });
        },
        component: () => undefined
      },
      {
        path: '/nastaveni',
        name: 'account-settings',
        component: () =>  import('@/views/AccountSettings.vue'),
        meta: {
          loggedIn: true
        }
      },
      {
        path: '/oblibene-inzeraty',
        name: 'favorites',
        component: () => import('@/views/Favorites.vue'),
        meta: {
          loggedIn: true
        }
      },
      {
        path: '/uzivatele',
        name: 'users',
        component: () =>  import('@/views/admin/Users.vue'),
        meta: {
          loggedIn: true,
          admin: true
        }
      },
      {
        name: 'login',
        path: '/prihlaseni',
        component: () => import('@/views/Login.vue'),
        meta: {
          loggedOut: true
        }
      },
      {
        name: 'register',
        path: '/registrace',
        component: () => import('@/views/Register.vue'),
        meta: {
          loggedOut: true
        }
      }
    ],
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})


router.beforeEach((to, from) => {
  const userStore = useAuthStore()


  if (to.meta.loggedIn && !userStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.loggedOut && userStore.isAuthenticated) {
    return {
      name: 'home'
    }
  }

  if (to.meta.admin && !userStore.isAdmin) {
    return {
      name: 'home'
    }
  }
})



export default router
