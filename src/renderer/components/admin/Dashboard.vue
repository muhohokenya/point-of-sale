<template>
  <main class="">
    <div class="row ">
      <div class="col-md-6 mt-5 pr-2">

<!--        <button @click="logout">{{ user }}</button>-->

        <div class="row">
          <div class="col">
            <label for="search"></label>
            <input ref="search" type="search" class="form-control form-control-lg" id="search" v-model="search" placeholder="Search By Name">
          </div>
        </div>

        <notifications group="sale" position="top right"/>


        <div class="row mt-3">
          <div class="col vh-100">
            <div v-if="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <table v-else class="table table-hover">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Selling Price</th>
                <th>Available Qty</th>
                <th>Sell</th>
              </tr>
              <tr v-for="(item,index) in filteredItems">
                <td>{{ index += 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ currency(item.selling_price) }}</td>
                <td>{{ item.available_qty }}</td>
                <td>
                  <button v-if="item.available_qty>0" @click="addToCart(item)" class="btn btn-sm btn-outline-dark">
                    <img :src="cartIcon" alt=""> &plus;
                  </button>
                  <p v-else class="text-danger">Out Of Stock</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div v-if="cart.length" style="position: fixed;top:2rem;">
          <div class="card">
            <div class="card-header">
              <h2>Total : {{ cart_total }}</h2>
            </div>
            <div class="card-body">
              <p class="lead text-muted">
                When You Add an Item from the &leftarrow; left side, It gets added to the current Order
              </p>


              <!--<div class="form-group">
                <label for="quantity">Quantity</label>
                <input id="quantity" type="text" class="form-control form-control-lg" v-bind="cart.qty">
              </div>-->
              <table class="table table-hover">
                <tr>
                  <td>#</td>
                  <td>Item</td>
                  <td>Price</td>
                  <td>Qty</td>
                  <td>Total</td>
                  <td colspan="2">Action</td>
                </tr>
                <tr v-for="(item,index) in cart">
                  <td>{{ index += 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ currency(item.selling_price) }}</td>
                  <!--<td>
                    <label>
                      <input  @keyup="calculateQty(item)"  id="qty" type="text" min="1" minlength="1">
                    </label>
                  </td>-->
                  <td>
                    <b v-if="item.available_qty === item.qty" class="text-danger">{{item.qty}}</b>
                    <b v-else>{{item.qty}}</b>
                  </td>
                  <td>{{ currency(item.total) }}</td>
                  <td>
                    <button @click="addToCart(item)" class="btn btn-outline-success">&plus;</button>
                  </td>
                  <td>
                    <button @click="removeFromCart(item)" class="btn btn-outline-danger">&minus;</button>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{{cart_total}}</td>
                </tr>

              </table>

              <div class="form-group">
                <label for="amount_tendered">Amount</label>
                <input :class="{'is-invalid':errors.amount_tendered}" type="text" class="form-control form-control-lg" v-model="amount_tendered" id="amount_tendered">
                <div class="text-danger" v-if="errors.amount_tendered">{{ errors.amount_tendered[0]}}</div>
              </div>
            </div>
            <div class="card-footer">
              <button @click="checkOutItems" class="btn btn-lg btn-block btn-outline-success">Complete</button>
            </div>
          </div>
        </div>
      </div>


    </div>

  </main>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import {mapState} from 'vuex'
import axios from 'axios'
import swal from 'sweetalert'
const {PosPrinter} = require('electron').remote.require('electron-pos-printer')
const path = require('path')
export default {
  name: 'Dashboard',
  components: {
    Datepicker
  },
  data () {
    return {
      base_url: '',
      search: '',
      cartIcon: 'static/assets/cart.ico',
      loading: false,
      cart: [],
      order_items: [],
      items: [],
      item: '',
      selected: [],
      amount_tendered: '',
      amount_sold_at: '',
      quantity: 1,
      errors: '',
      payable: '',
      options: {
        preview: false, // Preview in window or print
        width: '250px', //  width of content body
        margin: '0 0 0 0', // margin of content body
        copies: 1, // Number of copies to print
        printerName: 'FK58 Printer(2)', // printerName: string, check it at webContent.getPrinters()
        timeOutPerLine: 400
      }
    }
  },
  beforeRouteEnter (to, from, next) {
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
          next()
        }).catch(error => {
          console.log(error)
        })
      }
    } else {
      alert('no auth')
    }
  },
  watch: {
    // whenever quantity changes, this function will run
    quantity: function () {
      this.payable = this.item.selling_price * this.quantity
    }
  },
  computed: {
    ...mapState(['user']),
    filteredItems () {
      return this.items.filter(item => {
        return item.name.toUpperCase().match(this.search.toUpperCase())
      })
    },
    cart_total () {
      let total = []
      this.cart.forEach(item => {
        total.push(item.total)
      })

      let sum = total.reduce(function (a, b) {
        return a + b
      }, 0)

      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ksh'
      })
      return formatter.format(sum)
    }
  },
  methods: {
    logout () {
      this.logout()
    },
    calculateQty (item) {
      let key = parseInt(event.key)
      // alert(key)
      console.log(typeof key)
      /* if (typeof key === 'number') {
        alert('okay')
      } */

      // console.log(this)
      // this.cart[this.cart.indexOf(item)].qty = 200
      // console.log(this.quantity)
    },
    print () {
      const data = [
        {
          type: 'image',
          path: path.join(__dirname, 'assets/banner.png'), // file path
          position: 'center', // position of image: 'left' | 'center' | 'right'
          width: '60px', // width of image in px; default: auto
          height: '60px' // width of image in px; default: 50 or '50px'
        }, {
          type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'Item',
          style: `text-align:center;`,
          css: {'font-weight': '700', 'font-size': '18px'}
        }, {
          type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
          value: 'Secondary text',
          style: `text-align:left;color: red;`,
          css: {'text-decoration': 'underline', 'font-size': '10px'}
        }, {
          type: 'barCode',
          value: 'HB4587896',
          height: 12, // height of barcode, applicable only to bar and QR codes
          width: 1, // width of barcode, applicable only to bar and QR codes
          displayValue: true, // Display value below barcode
          fontsize: 8
        }, {
          type: 'qrCode',
          value: 'https://github.com/Hubertformin/electron-pos-printer',
          height: 55,
          width: 55,
          style: 'margin: 10 20px 20 20px'
        }, {
          type: 'table',
          // style the table
          style: 'border: 1px solid #ddd',
          // list of the columns to be rendered in the table header
          tableHeader: ['Item', 'Value'],
          // multi dimensional array depicting the rows and columns of the table body
          tableBody: [
            ['Item Test', 2]
          ],
          // list of columns to be rendered in the table footer
          tableFooter: ['Item', 'Value'],
          // custom style for the table header
          tableHeaderStyle: 'background-color: #000; color: white;',
          // custom style for the table body
          tableBodyStyle: 'border: 0.5px solid #ddd',
          // custom style for the table footer
          tableFooterStyle: 'background-color: #000; color: white;'
        }, {
          type: 'table',
          style: 'border: 1px solid #ddd', // style the table
          // list of the columns to be rendered in the table header
          tableHeader: [{type: 'text', value: 'Animal'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
          // multi dimensional array depicting the rows and columns of the table body
          tableBody: [
            [{type: 'text', value: 'Cat'}, {type: 'image', path: './animals/cat.jpg'}],
            [{type: 'text', value: 'Dog'}, {type: 'image', path: './animals/dog.jpg'}],
            [{type: 'text', value: 'Horse'}, {type: 'image', path: './animals/horse.jpg'}],
            [{type: 'text', value: 'Pig'}, {type: 'image', path: './animals/pig.jpg'}]
          ],
          // list of columns to be rendered in the table footer
          tableFooter: [{type: 'text', value: 'Animal'}, 'Image'],
          // custom style for the table header
          tableHeaderStyle: 'background-color: #000; color: white;',
          // custom style for the table body
          tableBodyStyle: 'border: 0.5px solid #ddd',
          // custom style for the table footer
          tableFooterStyle: 'background-color: #000; color: white;'
        }
      ]

      PosPrinter.print(data, this.options)
        .then(() => {})
        .catch((error) => {
          console.error(error)
        })
    },
    checkOutItems () {
      this.cart.forEach(item => {
        this.order_items.push({
          item_id: item.id,
          qty: item.qty,
          amount: item.selling_price,
          total: item.selling_price * item.qty
        })
      })

      let payload = {
        items: this.order_items,
        amount_tendered: this.amount_tendered
      }

      axios.post('http://psq.covid-19.co.ke/api/checkout', payload).then(response => {
        console.log(response.data)
        this.order_items = []
        this.cart = []
        this.fetchItems()
        swal('Success! Sale has Been Successfully made!', {
          icon: 'success'
        })
        // this.print()
      }).catch(error => {
        this.order_items = []
        this.errors = error.response.data
      })
    },
    addToCart (item) {
      if (this.cart.includes(item)) {
        const index = this.cart.indexOf(item)
        if (item.available_qty > this.cart[index].qty) {
          this.cart[index].qty += 1
        } else {
          const myNotification = new Notification('Stock Limit', {
            title: 'Error',
            body: 'This Item has reached the max Limit in the Stock'
          })

          myNotification.onclick = () => {
            console.log('Notification clicked')
          }

          // this.$notify({
          //   type: 'error',
          //   duration: 20000,
          //   speed: 2000,
          //   group: 'sale',
          //   text: '<b>This Item has reached the max Limit in the Stock</b>'
          // })
        }
        // console.log(index)
        this.cart[index].total = item.selling_price * item.qty
      } else {
        this.cart.push(item)
      }
    },

    removeFromCart (item) {
      const index = this.cart.indexOf(item)
      if (this.cart[index].qty > 1) {
        let qty = this.cart[index].qty -= 1
        this.cart[index].total = this.cart[index].selling_price * qty
        this.cart.splice(this.cart[index], -1)
      } else if (this.cart[index].qty === 1) {
        this.cart.splice(index, 1)
      }
    },
    selectItem (item) {
      this.amount_tendered = ''
      this.amount_sold_at = ''
      this.quantity = 1
      this.payable = ''
      this.item = item
    },
    unSelectItem (item) {
      this.item = ''
    },

    fetchItems () {
      this.loading = true
      this.token = localStorage.getItem('access_token')
      axios.get('http://psq.covid-19.co.ke/api/get-items-to-sell').then(response => {
        this.items = response.data
        this.loading = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
      })
    },
    dashboard () {
      this.$router.push({name: 'dashboard'})
    }
  },

  mounted () {
    this.$refs.search.focus()
    // this.$refs.qty.focus()
    this.fetchItems()
  }
}
</script>

<style>

#search{
  text-transform: uppercase;
}

.table.sticky tr th {
  position: sticky !important;
  top: 0 !important;
}

.table.sticky tr th:after {
  content: '' !important;
  width: 100% !important;
  position: absolute !important;
  background-color: red !important;
  bottom: 0;
  left: 0;
}
#number{
  width: 60px;
}
</style>
