<template>
  <main class="container-fluid">
    <div class="py-5">
      <div class="row">
        <div class="col">
          <table class="table table-bordered">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
            <tr v-for="(appUser,index) in users">
              <td>{{index+=1}}</td>
              <td>{{ appUser.name.toUpperCase()}}</td>
              <td>{{ appUser.email}}</td>
              <td>{{ appUser.roles[0].name}}</td>
              <td>
                <button class="btn btn-outline-info">Edit</button>
              </td>
              <td>

                <button v-if="appUser.roles[0].name !== 'super admin'" @click="deleteUser(appUser)" class="btn btn-outline-danger">Delete</button>
                <button v-else disabled class="btn btn-outline-danger">Delete</button>
              </td>
            </tr>
          </table>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-header">
              <h2>Users</h2>
            </div>
            <div class="card-body">
              <p class="lead">
                Create User
              </p>
              <div class="form-group">
                <label for="name">Name</label>
                <input :class="{'is-invalid':errors.name}" v-model="form.name" id="name" type="text" class="form-control form-control-lg" placeholder="Name">
                <div class="text-danger" v-if="errors.name">{{ errors.name[0]}}</div>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input :class="{'is-invalid':errors.email}" v-model="form.email" id="email" type="text" class="form-control form-control-lg" placeholder="Email">
                <div class="text-danger" v-if="errors.email">{{ errors.email[0]}}</div>
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input :class="{'is-invalid':errors.password}" v-model="form.password" id="password" type="text" class="form-control form-control-lg" placeholder="Password">
                <div class="text-danger" v-if="errors.password">{{ errors.password[0]}}</div>
              </div>
              <div class="form-group">
                <label for="role">Roles</label>
                <select :class="{'is-invalid':errors.role}" v-model="form.role" name="role" id="role" class="form-control form-control-lg">
                  <option v-for="role in roles" :value="role.name">{{role.name}}</option>
                </select>
                <div class="text-danger" v-if="errors.role">{{ errors.role[0]}}</div>
              </div>
              <button @click="createUser" class="btn btn-lg btn-outline-primary">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'
import {mapState} from 'vuex'
export default {
  name: 'Users',
  computed: mapState(['user']),
  data () {
    return {
      super_admin: false,
      roles: [],
      users: [],
      errors: '',
      form: {
        name: '',
        email: '',
        password: '',
        role: ''
      }
    }
  },
  mounted () {
    this.fetchRoles()
    this.fetchUsers()
    this.hasAccess('super admin')
  },
  methods: {
    hasAccess (role) {
      this.user.authUser.roles.forEach(userRole => {
        console.log(userRole)
        this.super_admin = role === userRole.name
      })
    },
    deleteUser (user) {
      swal({
        title: 'Are you sure you want to delete ' + user.name + '?',
        text: 'Once deleted, you will not be able to recover!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
        .then((willDelete) => {
          if (willDelete) {
            axios.delete(this.base_url + '/delete-user/' + user.id).then(response => {
              this.fetchUsers()
              swal('Success! User has been deleted!', {
                icon: 'success'
              })
            })
          }
        })
    },
    fetchRoles () {
      axios.get(this.base_url + '/roles').then(response => {
        this.roles = response.data
      })
    },
    fetchUsers () {
      axios.get(this.base_url + '/users').then(response => {
        this.users = response.data
      })
    },
    createUser () {
      axios.post('http://psq.covid-19.co.ke/api/create-user', this.form).then(response => {
        swal('Success! Sale has Been Successfully made!', {
          icon: 'success'
        })
        this.fetchUsers()
      }).catch(error => {
        this.errors = error.response.data
      })
    }
  }
}
</script>

<style scoped>

</style>