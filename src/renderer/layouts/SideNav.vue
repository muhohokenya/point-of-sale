<template>
  <transition  enter-active-class="animate__animated animate__fadeInLeft"
               leave-active-class="animate__animated animate__fadeOutLeft">
    <div v-if="user.loggedIn" class="bg-light border-right" style="width: 20rem;" id="sidebar-wrapper">
      <!--        <div class="sidebar-heading text-white">Point Of Sale</div>-->
      <transition name="fade">
        <div  class="list-group list-group-flush">
          <router-link class="list-group-item list-group-item-action bg-light" to="/">
            <img :src="imageUrl" alt=""> Sell
          </router-link>
          <router-link class="list-group-item list-group-item-action bg-light" to="/items">
            <img :src="itemsIcon" alt=""> Items
          </router-link>
          <router-link class="list-group-item list-group-item-action bg-light" to="/categories">
            <img :src="tableImg" alt="">
            Categories
          </router-link>
          <router-link class="list-group-item list-group-item-action bg-light" to="/inventory">
            <img :src="stockImg" alt="">
            Inventory
          </router-link>

          <router-link v-if="super_admin"  class="list-group-item list-group-item-action bg-light" to="/users">
            <img :src="usersImg" alt="">
            Users
          </router-link>
          <router-link v-if="super_admin" class="list-group-item list-group-item-action bg-light" to="/settings">
            <img :src="cogImg" alt="">
            Settings
          </router-link>

          <router-link v-if="super_admin" class="list-group-item list-group-item-action bg-light" to="/sales">
            <img :src="reportsImg" alt="">
            Reports
          </router-link>

          <button @click.prevent="logout" class="list-group-item list-group-item-action bg-light fixed-bottom" style="width: 17rem;">
            <img :src="logOutImg" alt="">

            Logout {{user.authUser.name}}
          </button>



        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import axios from 'axios'
import store from '../store'

export default {
  name: 'SideNav',
  created () {
    this.hasAccess('super admin')
  },
  computed: mapState(['user']),
  data () {
    return {
      super_admin: false,
      loggedIn: this.$auth,
      imageUrl: 'static/assets/win.ico',
      salesIcon: 'static/assets/sales.png',
      itemsIcon: 'static/assets/menu.ico',
      tableImg: 'static/assets/table.ico',
      stockImg: 'static/assets/stock.ico',
      usersImg: 'static/assets/users.ico',
      cogImg: 'static/assets/cog.ico',
      reportsImg: 'static/assets/reports.ico',
      logOutImg: 'static/assets/logout.ico'
    }
  },
  beforeRouteEnter (to, from, next) {
    alert('go')
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('access_token') == null) {
        next({
          path: '/login',
          params: {nextUrl: to.fullPath}
        })
      } else {
        let url = 'http://psq.covid-19.co.ke/api/auth/me'
        axios.post(url, '', {
          headers: {
            'Authorization': 'Bearer' + localStorage.getItem('access_token')
          }
        }).then(response => {
          // this.loggedIn = true
          next()
        }).catch(error => {
          console.log(error + ' iko hapa')
        })
      }
    } else {
      alert('no auth')
    }
  },
  methods: {
    ...mapActions(['UNSET_SET_AUTH_USER']),
    dashboard () {
      this.$router.push({name: 'dashboard'})
    },
    hasAccess (role) {
      this.user.authUser.roles.forEach(userRole => {
        console.log(userRole)
        this.super_admin = role === userRole.name
      })
    },
    logout () {
      let url = 'http://psq.covid-19.co.ke/api/auth/logout'
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
</script>

<style scoped>

</style>