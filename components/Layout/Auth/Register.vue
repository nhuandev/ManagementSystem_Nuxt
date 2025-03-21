<script>
export default {
  name: "register",
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async submit() {
      await fetch('http://localhost:3005/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      });

      await this.$router.push('/auth/login');
    }
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Please register</h1>

    <input v-model="username" class="form-control" placeholder="Name" required>

    <input v-model="password" type="password" class="form-control" placeholder="Password" required>

    <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
  </form>
</template>