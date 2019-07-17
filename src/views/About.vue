<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div>
      <h2>This is an about page</h2>
      <p>You're in :)</p>
    </div>
    <v-btn color="danger" @click="logout">Salir</v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase';

export default {
  name: 'home',
  components: {},
  methods: {
    async logout() {
      await firebase.auth().signOut();
      this.$router.replace('login');
    },
  },
};
</script>
