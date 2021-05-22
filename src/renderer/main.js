import Vue from 'vue'
// import LaravelPermissionToVueJS from 'laravel-permission-to-vuejs'

import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import '../renderer/assets/css/app.css'
import App from './App'
import router from './router'
import store from './store'
// import LaravelPermissionToVueJS from 'laravel-permission-to-vuejs'
import Notifications from 'vue-notification'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// Vue.use(LaravelPermissionToVueJS)
Vue.use(Notifications)
// Vue.use(LaravelPermissionToVueJS)
let myMixin = {
  data () {
    return {
      base_url: 'http://psq.covid-19.co.ke/api',
      items: []
    }
  },
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      // console.log('hello from mixin!')
    },
    fetchItems () {
      return axios.get(this.base_url + '/get-items').then(response => {
        return response.data
      })
    },
    currency (amount) {
      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ksh'
      })

      return formatter.format(amount)
    },
    logout () {
      let url = this.base_url + '/auth/logout'
      axios.post(url, '', {
        headers: {
          'Authorization': 'Bearer' + localStorage.getItem('access_token')
        }
      }).then(response => {
        store.dispatch('UNSET_SET_AUTH_USER')
        this.$router.push({path: '/login'})
        localStorage.removeItem('access_token')
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        // console.log(error)
      })
    }
  }
}
Vue.mixin(myMixin)
/* eslint-disable no-new */
new Vue({
  // mixins: myMixin,
  components: { App },
  data: {
    authenticated: 'muhoho dev'
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
