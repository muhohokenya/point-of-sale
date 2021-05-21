<template>
<main class="container-fluid">
  <div class="py-5">
    <div class="row">
      <div class="col">
        <div class="card shadow-sm">
          <div class="card-header">
            <h2>Settings</h2>
          </div>
          <div class="card-body">
            <p class="lead">
              Change Password
            </p>
            <div class="form-group">
              <label for="old_password">Old Password</label>
              <input v-model="form.old_password" id="old_password" type="password" class="form-control form-control-lg" placeholder="Enter the old Password">
              <div class="text-danger" v-if="errors.old_password">{{ errors.old_password[0]}}</div>
            </div>

            <div class="form-group">
              <label for="new_password">New Password</label>
              <input v-model="form.new_password" id="new_password" type="password" class="form-control form-control-lg" placeholder="Enter the new Password">
              <div class="text-danger" v-if="errors.new_password">{{ errors.new_password[0]}}</div>
            </div>

            <!--<div class="form-group">
              <label for="confirm_new_password">Confirm New Password</label>
              <input id="confirm_new_password" type="text" class="form-control form-control-lg" placeholder="Confirm New Password">
            </div>-->

            <button @click="updatePassword" class="btn btn-lg btn-outline-primary">Change password</button>
          </div>
        </div>
      </div>
      <div class="col"></div>
    </div>

    <div class="row mt-5">
      <div class="col border py-3">
        <p class="lead">
          Please connect to the internet then check for latest updates
        </p>
        <button v-if="checkingUpdates" class="btn btn-light mt-2">
          <span class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </span>
          Checking for updates...
        </button>
        <button v-else @click="checkForUpdates" class="btn btn-light">
          <img :src="updatesIcon" alt=""> Check for Updates
        </button>
        <p class="lead mt-2 text-success">
          {{updateResponse}}
        </p>
      </div>
      <div class="col"></div>
    </div>
  </div>
</main>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'
export default {
  name: 'Settings',
  data () {
    return {
      updateResponse: '',
      checkingUpdates: false,
      updatesIcon: 'static/assets/updates.ico',
      form: {
        old_password: '',
        new_password: ''
      },
      errors: ''
    }
  },
  methods: {
    checkForUpdates () {
      this.checkingUpdates = true
      this.updateResponse = ''
      setTimeout(() => {
        this.checkingUpdates = false
        this.updateResponse = 'There are no new updates found,System is up to date'
      }, 15000)
    },
    updatePassword () {
      let token = localStorage.getItem('access_token')
      axios.post(this.base_url + '/change-password', this.form, {
        headers: {
          'Authorization': 'Bearer' + token
        }
      })
        .then(response => {
          swal('Success! Password has been updated!', {
            icon: 'success'
          })
          this.logout()
        }).catch(error => {
          if (error.response.status === 422) {
            this.errors = error.response.data
          } else {
            swal('Error! Password did not match!', {
              icon: 'error'
            })
          }
          this.loading = false
          this.errors = error.response.data
        })
    }
  }
}
</script>

<style scoped>

</style>