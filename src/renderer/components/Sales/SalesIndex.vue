<template>
  <transition name="">
    <main v-if="show" class="container-fluid">

      <div class="row mb-5 position-fixed w-100" style="z-index: 1000;">
        <div class="col">
          <div class="jumbotron border border-secondary w-100 mb-5">
            <p class="lead">
              <button @click="selectReport('sales')" class="btn btn-primary btn-lg" role="button">Sales Reports</button>
              <button @click="selectReport('inventory')" class="btn btn-success btn-lg" role="button">Inventory History
                Reports
              </button>
              <!--              <a class="btn btn-info btn-lg" href="#" role="button">Profits and Loss Reports</a>-->
            </p>
          </div>
        </div>
      </div>

      <div v-if="report==='sales'" class="row">
        <div class="col-md-8">
          <div class="card min-vh-100 border border-secondary position-relative" style="top:13rem!important;">
            <div class="card-header bg-light">
              <p class="card-title text-center">All Sales</p>
              <div class="row">
                <div class="col">
                  <div class="">
                    <!--                    <button class="btn btn-sm btn-success"><img :src="excelfIcon" alt="">Download Excel</button>-->
                    <!--                    <button class="btn btn-sm btn-danger"><img :src="pdfIcon" alt="">Download Pdf</button>-->
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">

              <div class="row">
                <div class="col-md-8 border-right">
                  <p class="lead">
                    Filter between two dates
                  </p>
                  <div class="row">
                    <div class="col">
                      <div class="form-group">
                        <label for="start_date">Start Date</label>
                        <input :class="{'is-invalid':errors.start_date}" v-model="form_filter.start" type="date"
                               id="start_date" class="form-control">
                        <div class="text-danger" v-if="errors.start_date">{{ errors.start_date[0] }}</div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-group">
                        <label for="end_date">End Date</label>
                        <input :class="{'is-invalid':errors.end_date}" v-model="form_filter.to" type="date"
                               id="end_date" class="form-control">
                        <div class="text-danger" v-if="errors.end_date">{{ errors.end_date[0] }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">

                    <button @click="getSalesBetweenStartTo" class="btn btn-outline-success">Filter</button>
                    <button @click="fetchSales" v-if="filter_btn_dates" class="btn btn-outline-danger">&times;</button>
                  </div>
                </div>

                <div class="col-md-4">
                  <p class="lead">
                    Filter Sales for a specific date
                  </p>
                  <div class="row">
                    <div class="col">
                      <div class="form-group">
                        <label for="specific_date">Specific Date</label>
                        <input v-model="specific_date" type="date" id="specific_date"
                               :class="{'is-invalid':errors.date}" class="form-control">
                        <div class="text-danger" v-if="errors.date">{{ errors.date[0] }}</div>
                      </div>

                      <button @click="getSalesForSpecificDate" class="btn btn-outline-info">Filter specific Date
                      </button>
                      <button @click="fetchSales" v-if="filter_specific_date" class="btn btn-outline-danger">&times;
                      </button>
                    </div>
                  </div>
                </div>
              </div>


              <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div class="text-center text-muted">
                <div v-if="filter_specific_date">
                  <h5> Showing Sales made on Date: {{ specific_date }}</h5>
                </div>
                <div v-else-if="filter_btn_dates">
                  <h5> Showing Sales made on From Date: {{ form_filter.start }} To {{ form_filter.to }}</h5>
                </div>
                <div v-else>
                  <h5>Showing sales for the last 7 days</h5>
                </div>
              </div>
                <table class="table">
                  <tr>
                    <th>#</th>
                    <th>Receipt</th>
                    <th>Amt</th>
                    <th>Cost</th>
                    <th>Balance</th>
                    <th>Date</th>
                  </tr>
                  <tr v-for="(sale,index) in sales">
                    <td>{{ index += 1 }}</td>
                    <td>
                      <button @click="selectSale(sale)" class="btn btn-sm btn-outline-secondary">
                        <img :src="receiptIcon" alt="">
                        {{ sale.receipt_no }}
                      </button>
                    </td>
                    <td>{{ currency(sale.amount_tendered) }}</td>
                    <td class="text-success">{{ currency(sale.total) }}</td>
                    <td class="text-info">{{ currency(sale.balance) }}</td>
                    <td>{{ sale.created_at }}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
<!--                    <td>{{ total_sales }}</td>-->
                  </tr>
                </table>
            </div>
          </div>
        </div>

        <section class="col-md-4">
          <div class="row  text">
            <div class="col">

              <div style="position: fixed;top:10rem;width: 25%">
                <div class="row">
                  <div class="col" style="top:10rem">

                    <transition enter-active-class="animate__animated animate__fadeInRight"
                                leave-active-class="animate__animated animate__fadeOutUp">
                      <section v-if="sale">
                        <div class="card shadow-lg">
                          <div class="card-header  text-center">
                            Date : {{ sale.created_at }}
                            <button @click="sale = null" class="btn btn-outline-secondary float-right"> &times; Close
                            </button>
                          </div>
                          <div class="card-body">
                            <table class="table table-bordered">
                              <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Total</th>
                                <th>Qty</th>
                              </tr>
                              <tr v-for="(sale_item,index) in sale.items">
                                <td>{{ index += 1 }}</td>
                                <td>{{ sale_item.item.name.toUpperCase() }}</td>
                                <td>{{ currency(sale_item.total) }}</td>
                                <td>{{ sale_item.qty }}</td>
                              </tr>
                              <tr>
                                <td></td>
                                <td></td>
                                <td>{{ order_total }}</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </section>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <div class="row" v-if="report==='inventory'">
        <div class="col-md-10">
          <div class="min-vh-100 position-relative" style="top:13rem!important;">
            <inventory-reports class="py-5"></inventory-reports>
          </div>
        </div>
      </div>
    </main>
  </transition>

</template>

<script>
import axios from 'axios'
import InventoryReports from '../InventoryReports'
// import 'animate.css'
export default {
  name: 'SalesIndex',

  components: {
    InventoryReports
  },
  data () {
    return {
      report: '',
      pdfIcon: 'static/assets/pdf.ico',
      receiptIcon: 'static/assets/receipt.ico',
      excelfIcon: 'static/assets/excel.ico',
      filter_btn_dates: false,
      filter_specific_date: false,
      filter_by_date: false,
      specific_date: '',
      form_filter: {
        start: '',
        to: ''
      },
      loading: false,
      sales: [],
      sale: '',
      show: true,
      errors: ''
    }
  },
  computed: {
    order_total () {
      let orderTotal = []
      this.sale.items.forEach(saleItem => {
        orderTotal.push(saleItem.total)
      })

      let sum = orderTotal.reduce(function (a, b) {
        return a + b
      }, 0)

      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ksh'
      })

      return formatter.format(sum)
    },
    total_sales () {
      let totalSales = []
      this.sales.forEach(sale => {
        totalSales.push(sale.total)
      })

      let sum = totalSales.reduce(function (a, b) {
        return a + b
      }, 0)

      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KSH'
      })

      return formatter.format(sum)
    }
  },

  mounted () {
    this.fetchSales()
  },
  methods: {
    selectReport (report) {
      this.report = report
    },
    fetchSales () {
      this.loading = true
      this.filter_btn_dates = false
      this.filter_specific_date = false
      this.specific_date = ''
      this.form_filter.start = ''
      this.form_filter.to = ''
      this.errors = ''
      axios.get('http://psq.covid-19.co.ke/api/sales').then(response => {
        this.sales = response.data
        this.loading = false
        // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        this.loading = false
      })
    },
    getSalesForSpecificDate () {
      this.loading = true
      this.filter_specific_date = true
      let data = {
        date: this.specific_date
      }
      axios.post(this.base_url + '/sales-for-specific-date', data)
        .then(response => {
          this.loading = false
          this.sales = response.data
        }).catch(error => {
          this.loading = false
          this.errors = error.response.data
        })
    },
    getSalesBetweenStartTo () {
      this.filter_btn_dates = true
      let data = {
        start_date: this.form_filter.start,
        end_date: this.form_filter.to
      }
      axios.post('http://psq.covid-19.co.ke/api/sales-between-start-to', data)
        .then(response => {
          this.sales = response.data
        }).catch(error => {
          this.errors = error.response.data
        })
    },
    selectSale (sale) {
      this.sale = sale
      // setTimeout(, 3000)
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}


.w-100 {
  width: 90% !important;
}
</style>
