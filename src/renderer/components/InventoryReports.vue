<template>
<main>
  <div class="row">
    <div class="col">
      <div class="card" >
        <div class="card-header">
          Inventory Log
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <tr v-for="(item,index) in items">
              <td>{{ index+=1 }}</td>
              <td>{{ item.name }}</td>
              <td>
                <button class="btn btn-outline-secondary" @click="selectItem(item)">View History</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="col" style="height: auto;">
      <div v-if="item" class="card" style="position: fixed;width: 40%!important;height:45rem!important; overflow: auto">
        <div class="card-header">
          {{item.name}} Logs
        </div>
        <div class="card-body">
          <table class="table">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Opening</th>
              <th>Activity</th>
              <th>Quantity</th>
              <th>Closing</th>
            </tr>
            <tr v-for="(item_log,index) in item.logs">
              <td>{{ index+=1 }}</td>
              <td>{{ item_log.created_at}}</td>
              <td>{{ item_log.opening_stock}}</td>
              <td>{{ (item_log.activity === 'add') ? 'top up': item_log.activity }}</td>
              <td>{{ item_log.quantity}}</td>
              <td>{{ item_log.closing_stock}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</main>
</template>

<script>
export default {
  name: 'Reports',
  data () {
    return {
      item: '',
      items: []
    }
  },
  methods: {
    selectItem (item) {
      this.item = item
    }
  },
  mounted () {
    this.fetchItems().then(response => {
      this.items = response
    })
  }
}
</script>

<style scoped>

</style>
