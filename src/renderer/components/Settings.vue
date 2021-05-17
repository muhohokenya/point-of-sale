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
              <input id="old_password" type="text" class="form-control form-control-lg" placeholder="Old Password">
            </div>

            <div class="form-group">
              <label for="new_password">New Password</label>
              <input id="new_password" type="text" class="form-control form-control-lg" placeholder="New Password">
            </div>

            <div class="form-group">
              <label for="confirm_new_password">Confirm New Password</label>
              <input id="confirm_new_password" type="text" class="form-control form-control-lg" placeholder="Confirm New Password">
            </div>

            <button class="btn btn-lg btn-outline-primary">Save</button>
          </div>
        </div>
      </div>
      <div class="col"></div>
    </div>

    <div class="row mt-5">
      <div class="col border py-5">
        <p class="lead">
          Please connect to the internet then check for latest updates
        </p>
        <button class="btn btn-light">
          <img :src="updatesIcon" alt=""> Check for Updates
        </button>
      </div>
      <div class="col"></div>
    </div>
  </div>
</main>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      updatesIcon: 'static/assets/updates.ico'
    }
  }
}
</script>

<style scoped>

</style>