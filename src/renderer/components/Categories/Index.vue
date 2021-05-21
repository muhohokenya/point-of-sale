<template>
  <main class="container-fluid">
    <div class="row">
      <div class="col-md-7 mt-5 pr-2">
        <h3>Categories</h3>
        <div class="row">
          <div v-if="editMode"><i>
            <div class="col">Updating... {{ form.name}}</div>
          </i></div>
          <div v-else class="col">
            <div class="form-group" style="position: -webkit-sticky;top: 0!important;">
              <label for="name">Name</label>
              <input :class="{'is-invalid':errors.name}" v-model="form.name" type="text"
                     class="form-control form-control-lg" id="name" placeholder="category name">
              <span class="text-danger" v-if="errors.name">{{ errors.name[0] }}</span>
            </div>


            <button @click="addCategory" class="btn btn-outline-primary">
              Add
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col">
            <div class="card">
              <div class="card-header">
                Categories
              </div>
              <div class="card-body">
                <table class="table table-bordered">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                  <tr v-for="(category,currentIndex) in categories">
                    <td>{{ currentIndex += 1 }}</td>
                    <td>{{ category.name }}</td>
                    <td>

                      <button data-toggle="modal" data-target="#staticBackdrop"
                              @click="editCategory(category,currentIndex)" class="btn btn-outline-info">Edit
                      </button>
                    </td>
                    <td>
                      <button v-if="category.items.length" class="btn btn-outline-danger" disabled>Delete</button>
                      <button @click="deleteCategory(category)" v-else class="btn btn-outline-danger">Delete</button>
                    </td>
                  </tr>
                </table>


              </div>
            </div>
          </div>
        </div>
      </div>
      <div  class="col-md-5 bg-white vh-100">
        <div v-if="editMode" style="position: fixed;top:15rem;width: 20%;">
          <div class="form-group">
            <label for="category_edit">Category</label>
            <input id="category_edit" type="text" class="form-control form-control-lg" v-model="form.name">
          </div>

          <button @click="updateCategory" class="btn  btn-outline-primary">Update</button>
          <button @click="resetCategory" class="btn  btn-outline-danger">Cancel</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'

export default {
  name: 'Index',
  // beforeRouteEnter (to, from, next) {
  //   if (to.matched.some(record => record.meta.requiresAuth)) {
  //     if (localStorage.getItem('access_token') === null) {
  //       next({
  //         path: '/login',
  //         params: {nextUrl: to.fullPath}
  //       })
  //     } else {
  //       let url = 'http://psq.covid-19.co.ke/api/auth/me'
  //       axios.post(url, '', {
  //         headers: {
  //           'Authorization': 'Bearer' + localStorage.getItem('access_token')
  //         }
  //       }).then(response => {
  //         next()
  //       }).catch(error => {
  //         console.log(error)
  //       })
  //     }
  //   }
  // },
  data () {
    return {
      index: '',
      editMode: false,
      categories: [],
      category: '',
      errors: '',
      form: {
        id: '',
        name: ''
      }
    }
  },
  mounted () {
    this.fetchAll()
  },
  methods: {
    fetchAll () {
      axios.get('http://psq.covid-19.co.ke/api/category').then(response => {
        this.categories = response.data
      }).catch()
    },
    resetCategory () {
      this.editMode = false
      this.form.id = ''
      this.form.name = ''
    },
    editCategory (category, index) {
      this.index = index
      this.editMode = true
      this.form.id = category.id
      this.form.name = category.name
    },
    deleteCategory (category) {
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this imaginary file!',
        icon: 'warning',
        buttons: true,
        dangerMode: true
      })
        .then((willDelete) => {
          if (willDelete) {
            axios.delete('http://psq.covid-19.co.ke/api/category/' + category.id).then(response => {
              this.categories = this.categories.filter(function (cat) {
                return cat.id !== category.id
              })
            }).catch()
            swal('Success! Category has been deleted!', {
              icon: 'success'
            })
          } else {
            // swal('Your imaginary file is safe!')
          }
        })
    },
    addCategory () {
      let formData = new FormData()
      formData.append('name', this.form.name)
      axios.post('http://psq.covid-19.co.ke/api/category', formData)
        .then(response => {
          this.categories.push(response.data)
          this.form.name = ''
          swal('Success! Category has been Added!', {
            icon: 'success'
          })
        })
        .catch(error => {
          this.errors = error.response.data
        })
    },
    updateCategory () {
      let formData = new FormData()
      formData.append('name', this.form.name)
      axios.put('http://psq.covid-19.co.ke/api/category/' + this.form.id, this.form)
        .then(response => {
          this.resetCategory()
          this.fetchAll()
        })
        .catch(error => {
          this.errors = error.response.data
        })
    }
  }
}
</script>

<style scoped>

</style>
