<template>
  <main class="container-fluid">
    <div class="row">
      <div class="col-md-7 py-5 pr-2">
        <div class="row mt-5">
          <div class="col">
            <h3 class="text-center text-muted">ITEMS</h3>
            <table class="table table-striped ">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Purchase</th>
                <th>Selling</th>
                <th>Qty</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th colspan="2">Action</th>
              </tr>
              <tr v-for="(item,index) in items">
                <td>{{ index += 1 }}</td>
                <td>{{ item.name.toUpperCase() }}</td>
                <td class="text-danger">{{ currency(item.purchase_price) }}</td>
                <td class="text-success">{{ currency(item.selling_price) }}</td>
                <td class="text-info">{{ item.quantity }}</td>
                <td>{{ item.category.name }}</td>
                <!--<td>
                  <button v-if="item.quantity<1" class="btn btn-outline-danger" @click="updateStock(item)">Update</button>
                  <p  v-else class="text-success">Stock</p>
                </td>-->
                <td>
                  <button @click="editItem(item)" class="btn  btn-outline-info">Edit</button>
                </td>
                <td>
                  <button  v-if="item.sales.length>0"  class="btn  btn-outline-danger" disabled>Delete</button>
                  <button v-else @click="deleteItem(item)" class="btn  btn-outline-danger">Delete</button>

                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-5 vh-100 bg-white">
        <div class="row mt-5 " style="position: fixed;top:3rem;width: 35%;">
          <div class="col">
            <div v-if="editMode" class="card shadow">
              <div class="card-header">
                <p class="card-title">Edit Item</p>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="edit_name">Name</label>
                      <input v-model="form.name" :class="{'is-invalid':errors.name}" type="text"
                             class="form-control form-control-lg" id="edit_name">
                      <div class="text-danger" v-if="errors.name">{{ errors.name[0] }}</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label for="edit_purchase_price">Purchase Price</label>
                      <input v-model="form.purchase_price" :class="{'is-invalid':errors.purchase_price}" type="text"
                             class="form-control form-control-lg" id="edit_purchase_price">
                      <div class="text-danger" v-if="errors.purchase_price">{{ errors.purchase_price[0] }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="edit_selling_price">Selling Price</label>
                      <input v-model="form.selling_price" :class="{'is-invalid':errors.selling_price}" type="text"
                             class="form-control form-control-lg" id="edit_selling_price">
                      <div class="text-danger" v-if="errors.selling_price">{{ errors.selling_price[0] }}</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label for="edit_category">Category</label>
                      <select :class="{'is-invalid':errors.category}" v-model="form.category" name="category"
                              id="edit_category"
                              class="form-control form-control-lg">
                        <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                      </select>
                      <div class="text-danger" v-if="errors.category">{{ errors.category[0] }}</div>
                    </div>
                  </div>
                </div>

                <!--<div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="edit_quantity">Quantity</label>
                      <input v-model="form.quantity" :class="{'is-invalid':errors.quantity}" type="text"
                             class="form-control form-control-lg" id="edit_quantity">
                      <div class="text-danger" v-if="errors.quantity">{{ errors.quantity[0] }}</div>
                    </div>
                  </div>
                </div>-->
              </div>
              <div class="card-footer">
                <button @click="updateItem" class="btn  btn-outline-primary">Update</button>
                <button @click="clearForm" class="btn  btn-outline-dark">Cancel</button>
              </div>
            </div>
            <div v-else-if="deleteMode" class="text-danger">
              <div class="card">
                <div class="card-header">
                  <p class="card-title">Delete Item</p>
                </div>
                <div class="card-body">
                  <h3>Are you sure you want to delete this item</h3>
                </div>
                <div class="card-footer">
                  <button @click="deleteItem(item)" class="btn  btn-outline-danger">Confirm</button>
                  <button @click="deleteMode=false" class="btn  btn-outline-dark">Cancel</button>
                </div>
              </div>
            </div>
            <div v-else class="card shadow">
              <div class="card-header">
                <p class="card-title">Create Item</p>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="name">Name</label>
                      <input v-model="form.name" :class="{'is-invalid':errors.name}" type="text"
                             class="form-control form-control-lg" id="name">
                      <div class="text-danger" v-if="errors.name">{{ errors.name[0] }}</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label for="purchase_price">Purchase Price</label>
                      <input v-model="form.purchase_price" :class="{'is-invalid':errors.purchase_price}" type="text"
                             class="form-control form-control-lg" id="purchase_price">
                      <div class="text-danger" v-if="errors.purchase_price">{{ errors.purchase_price[0] }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="selling_price">Selling Price</label>
                      <input v-model="form.selling_price" :class="{'is-invalid':errors.selling_price}" type="text"
                             class="form-control form-control-lg" id="selling_price">
                      <div class="text-danger" v-if="errors.selling_price">{{ errors.selling_price[0] }}</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="form-group">
                      <label for="category">Category</label>
                      <select :class="{'is-invalid':errors.category}" v-model="form.category" name="category"
                              id="category"
                              class="form-control form-control-lg">
                        <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                      </select>
                      <div class="text-danger" v-if="errors.category">{{ errors.category[0] }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="quantity">Quantity</label>
                      <input v-model="form.quantity" :class="{'is-invalid':errors.quantity}" type="text"
                             class="form-control form-control-lg" id="quantity">
                      <div class="text-danger" v-if="errors.quantity">{{ errors.quantity[0] }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <button @click="createItem" class="btn  btn-outline-primary">Create</button>
                <button v-if="errors !== ''" @click="clearErrors" class="btn  btn-danger">&times;</button>
              </div>
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
  name: 'CreateItem',
  beforeRouteEnter (to, from, next) {
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
          next()
        }).catch(error => {
          console.log(error)
        })
      }
    } else {
      alert('no auth')
    }
  },
  data () {
    return {
      editMode: false,
      deleteMode: false,
      items: [],
      item: '',
      categories: [],
      form: {
        id: '',
        name: '',
        purchase_price: '',
        selling_price: '',
        quality: '',
        category: '',
        quantity: ''
      },
      errors: ''
    }
  },
  computed: mapState(['user']),
  mounted () {
    this.fetchItems()
    this.fetchCategories()
  },
  methods: {
    currency (amount) {
      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ksh'
      })

      return formatter.format(amount)
    },
    updateStock (item) {
      this.item = item
    },
    fetchItems () {
      axios.get('http://localhost/pos/public/api/item').then(response => {
        this.items = response.data
      }).catch()
    },
    fetchCategories () {
      axios.get('http://localhost/pos/public/api/category').then(response => {
        this.categories = response.data
      }).catch()
    },
    deleteItem (item) {
      // this.deleteMode = true
      // eslint-disable-next-line handle-callback-err
      axios.delete('http://localhost/pos/public/api/item/' + item.id).then(response => {
        this.items.splice(item, 1)
      }).catch(error => {
        this.errors = error.response.data
      })
    },
    editItem (item) {
      this.editMode = true
      this.item = item
      this.form.id = item.id
      this.form.name = item.name
      this.form.purchase_price = item.purchase_price
      this.form.selling_price = item.selling_price
      this.form.category = item.category.id
      // this.form.quantity = item.quantity
    },
    clearForm () {
      this.editMode = false
      this.item = ''
      this.form.id = ''
      this.form.name = ''
      this.form.purchase_price = ''
      this.form.selling_price = ''
      this.form.category = ''
      this.form.quantity = ''
    },
    clearErrors () {
      this.errors = ''
    },
    createItem () {
      axios.post('http://localhost/pos/public/api/item', this.form).then(response => {
        this.items.push(response.data)
        // this.items = response.data
        this.clearForm()
        swal('Success! New Item has been Added!', {
          icon: 'success'
        })
      }).catch(error => {
        this.errors = error.response.data

        const myNotification = new Notification('Error', {
          title: 'Error',
          urgency: 'critical',
          body: 'Error Adding Item'
        })

        myNotification.onclick = () => {
          console.log('Notification clicked')
        }
      })
    },
    updateItem () {
      axios.put('http://localhost/pos/public/api/item/' + this.form.id, this.form).then(response => {
        this.clearForm()
        this.fetchItems()
        swal('Success! Item has Been Successfully Updated!', {
          icon: 'success'
        })
      }).catch(error => {
        this.errors = error.response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
