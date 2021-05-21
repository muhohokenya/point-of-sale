<template>
  <div id="login" class="container" style="background: none!important;height: 95vh;">
    <div class="row justify-content-center mt-5">
<!--      <div class="col-md-6 mt-5"></div>-->
      <div class="col-md-6 mt-5">

<!--        {{user}}-->

        <transition  enter-active-class="animate__animated animate__fadeInRight"
                     leave-active-class="animate__animated animate__fadeOutRight">
        <div v-if="user.loggedIn===false" class="card shadow-lg" style="margin-top:40%;">
          <div class="card-header">
            <p class="card-title">Login</p>
          </div>
          <div class="card-body">

            <div v-if="errors">
              <div class="alert alert-danger" role="alert">
                Wrong Email or Password
              </div>
            </div>
            <section class="form-group">
              <label for="username">Email</label>
              <input placeholder="Enter your Email" :class="{'is-invalid':errors.email}" v-model="form.email" type="text" class="form-control form-control-lg"
                     id="username">
              <span v-if="errors.email" :class="{'text-danger':errors.email}">
                {{ errors.email[0] }}
              </span>
            </section>

            <section class="form-group">
              <label for="password">Password</label>
              <input placeholder="Enter your password"  v-model="form.password" type="password"
                     class="form-control  form-control-lg" id="password" :class="{'is-invalid':errors.password}">
              <span v-if="errors.password" :class="{'text-danger':errors.password}">
                {{ errors.password[0] }}
              </span>
            </section>


            <button v-if="signing_in" class="btn btn-lg btn-secondary" type="button" disabled>
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </button>
            <button v-else @click="login" class="btn btn-outline-secondary ">
              Login<img style="height: 30px" :src="logOutImg" alt="">
              </button>
          </div>
        </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<style >
#login{

}
</style>
<script>
// import SystemInformation from './LandingPage/SystemInformation'
import axios from 'axios'
// import store from './../store/'
import { mapActions, mapState } from 'vuex'
const {shell} = require('electron')
export default {
  name: 'landing-page',
  data () {
    return {
      logOutImg: 'static/assets/login.ico',
      signing_in: false,
      errors: '',
      reservations: '',
      form: {
        email: '',
        password: ''
      }
    }
  },
  computed: mapState(['user']),
  mounted () {

  },
  methods: {
    ...mapActions(['SET_AUTH_USER']),
    getUser () {
      let url = 'http://psq.covid-19.co.ke/api/auth/me'
      axios.post(url, '', {
        headers: {
          'Authorization': 'Bearer' + localStorage.getItem('access_token')
        }
      }).then(response => {
        this.SET_AUTH_USER(response.data).then(r => {
          this.$router.push({path: '/'})
        })
      }).catch(error => {
        console.log(error + ' iko hapa')
      })
    },
    login () {
      this.signing_in = true
      let url = 'http://psq.covid-19.co.ke/api/auth/login'
      axios.post(url, this.form).then(response => {
        this.signing_in = false
        localStorage.setItem('access_token', response.data.access_token)
        this.getUser()
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        shell.beep()
        this.signing_in = false
        this.errors = error.response.data
        console.log(error.response.data)
        setTimeout(() => {
          this.errors = ''
          console.clear()
        }, 3000)
        // this.errors = error.response.data
      })
    }
  }
}
</script>

