<template>
  <main class="container-fluid">
    <div class="row">
          <div class="col">
            <table class="table table-bordered mt-5">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Stock</th>
              </tr>
              <tr :class="{'text-danger':inventory.quantity<1}" v-for="(inventory,index) in inventories">
                <td>{{ index+=1 }}</td>
                <td>{{ inventory.name}}</td>
                <td>{{ inventory.quantity}}</td>
                <td>
                  <!-- Button trigger modal -->
                  <button @click="selectItem(inventory)" type="button" class="btn btn-outline-primary">
                   Update Stock
                  </button>
                </td>
              </tr>
            </table>
          </div>
      <div class="col bg-white vh-100">
          <div v-if="item && show_logs===false" class="row mt-5">
           <div class="col">
             <div class="card">
               <div class="card-header">
                 <h3 class="card-title">
                   {{item.name}}
                 </h3>
               </div>
               <div class="card-body">
                 <div class="form-group">
                   <p class="lead">
                     Please Enter the Quantity of Inventory you want to update, This will affect the Inventory available
                   </p>
                   <label for="qty">Qty</label>
                   <input id="qty" type="text" class="form-control form-control-lg" placeholder="Quantity" v-model="qty">
                 </div>

                 <button @click="updateStock(item)" class="btn  btn-outline-info">
                   Update Qty
                   <img :src="icons.updateIcon" alt="">
                   </button>
                 <button @click="item=null" class="btn  btn-light">
                   <img :src="icons.cancelIcon" alt="">
                 </button>
               </div>
             </div>
           </div>
          </div>

        <div v-if="show_logs===true">
          {{item}}
        </div>
      </div>
        </div>
  </main>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert'

export default {
  name: 'Inventory',
  data () {
    return {
      icons: {
        updateIcon: 'static/assets/update.ico',
        cancelIcon: 'static/assets/cancel.ico'
      },
      show_logs: false,
      item: '',
      qty: '',
      form: {
        name: '',
        unit: '',
        qty: '',
        value: ''
      },
      errors: '',
      inventories: []
    }
  },
  mounted () {
    this.fetchItems()
  },
  methods: {
    fetchItems () {
      axios.get('http://localhost/pos/public/api/item').then(response => {
        this.inventories = response.data
      }).catch(error => {
        this.errors = error.response.data
      })
    },
    updateStock (item) {
      let data = {
        item: item.id,
        quantity: this.qty
      }

      console.log(data)

      axios.post(this.base_url + '/add-stock', data).then(resonse => {
        swal('Success! Stock has Been Successfully updated!', {
          icon: 'success'
        })
        this.item = ''
        this.qty = ''
        this.fetchItems()
      }).catch(error => {
        this.errors = error.response.data
      })
    },
    selectItem (item) {
      // this.$refs
      this.item = item
    },
    showLogs (item) {
      this.show_logs = true
      this.item = item
    },
    createInventory () {
      axios.post('http://localhost/pos/public/api/inventories', this.form).then(response => {
        this.inventories.push(response.data)
      }).catch(error => {
        this.errors = error.response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
