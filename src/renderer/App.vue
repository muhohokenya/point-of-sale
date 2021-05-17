<template>
  <div id="app">


    <div class="d-flex" id="wrapper" style="">




      <!-- Page Content -->

      <side-nav v-if="user.loggedIn"></side-nav>
      <div id="page-content-wrapper" class="container-fluid">

        <router-view></router-view>

      </div>
      <!-- /#page-content-wrapper -->
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Notifications from 'vue-notification'
import { mapState, mapActions } from 'vuex'
import store from './store'
import SideNav from './layouts/SideNav'
export default {
  name: 'Point Of Sale',
  components: {
    SideNav,
    Notifications
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
        let url = 'http://localhost/pos/public/api/auth/me'
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
  created () {
    console.log('created')
    // this.hasAccess('super admin')
  },
  mounted () {
    console.log('mounted')
    // console.log(this.$store.state)
    if (localStorage.getItem('access_token') === null) {
      // this.loggedIn = false
      store.dispatch('UNSET_SET_AUTH_USER')
    } else {
      let url = 'http://localhost/pos/public/api/auth/me'
      axios.post(url, '', {
        headers: {
          'Authorization': 'Bearer' + localStorage.getItem('access_token')
        }
      }).then(response => {
        store.SET_AUTH_USER(response.data).then(r => {
          this.$router.push({path: '/'})
        })
      }).catch(error => {
        console.log(error + ' iko hapa')
      })
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
      let url = 'http://localhost/pos/public/api/auth/logout'
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

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

/* CSS */
.list-group-item{
  padding-top:25px;

}
#wrapper{
  background-color: #f9f9f9!important;

}
#sidebar-wrapper .list-group {
  width: 17rem!important;
  /*padding-right: 20rem;*/
  position: fixed;
}
img{
  margin-right: 10px;
}



.list-group-item{
  /*color: whitesmoke!important;*/
  /*background-color: #1e1a12!important;*/
}
.bg-light {
  background-color: transparent !important;
}

a.bg-light:hover, a.bg-light:focus,
button.bg-light:hover,
button.bg-light:focus {
  background-color: rgba(0,0,0,.2) !important;
}

@media (min-width: 576px) {
  #sidebar-wrapper .list-group {
    width: 14.7rem!important;
    /*padding-right: 20rem;*/
    position: fixed;
  }
}

@media (min-width: 676px) {
  #sidebar-wrapper .list-group {
    width: 17rem!important;
    /*padding-right: 20rem;*/
    position: fixed;
  }
}
</style>
