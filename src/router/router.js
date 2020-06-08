import Vue from 'vue'
import Router from 'vue-router'
import Home from '@views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        level: 1
      }
    },
    {
      path: '/guide',
      name: 'Guide',
      meta: {
        level: 2
      },
      component: () => import('@views/Guide.vue')
    },
    {
      path: '/search',
      name: 'Search',
      meta: {
        level: 2
      },
      component: () => import('@views/Search.vue')
    },
    {
      path: '/info',
      name: 'Info',
      meta: {
        level: 2
      },
      props: (route) => ({ locationProvince: route.query.locationProvince, locationCity: route.query.locationCity, locationDistrict: route.query.locationDistrict, reportLocation: route.query.reportLocation, locationType: route.query.locationType }),
      component: () => import('@views/Info.vue')
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        level: 0
      },
      component: () => import('@views/Login.vue')
    },
    {
      path: '/batch',
      name: 'Batch',
      meta: {
        level: 2
        // limit: 'DataEntry'
      },
      component: () => import('@views/entry/Batch.vue')
    },
    {
      path: '/preview',
      name: 'Preview',
      meta: {
        level: 3
      },
      component: () => import('@views/entry/Preview.vue')
    },
    {
      path: '/room_status',
      name: 'RoomStatus',
      meta: {
        level: 2,
        limit: 'RoomStatus'
      },
      component: () => import('@views/RoomStatus.vue')
    }
  ]
})
