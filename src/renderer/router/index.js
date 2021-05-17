import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: require('../components/admin/Dashboard').default,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/items',
      name: 'items',
      component: require('../components/Items/CreateItem').default,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: require('../components/Login').default
    },
    {
      path: '/categories',
      name: 'categories',
      component: require('../components/Categories/Index').default
    },
    {
      path: '/sales',
      name: 'sales',
      component: require('../components/Sales/SalesIndex').default
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: require('../components/Inventory').default
    },
    {
      path: '/reports',
      name: 'reports',
      component: require('../components/InventoryReports').default,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('../components/Settings').default,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/users',
      name: 'users',
      component: require('../components/Users').default,
      meta: {
        requiresAuth: true
      }
    }
  ]
})
