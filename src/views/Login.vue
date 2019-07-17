<template>
  <v-container>
    <v-layout>
      <v-flex xs12 md6>
        <v-btn color="success" @click="socialLogin('google')">Google sign-in</v-btn>
      </v-flex>

      <v-flex xs12 md6>
        <v-btn color="success" @click="socialLogin('facebook')">Facebook</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import url from 'url';

export default {
  methods: {
    async socialLogin(platform) {
      const { redirect } = this.$route.query;

      if (!platform) return;

      const providerFunction = platform === 'google' ? 'GoogleAuthProvider' : 'FacebookAuthProvider';

      const provider = new firebase.auth[providerFunction]();

      const { user } = await firebase.auth().signInWithPopup(provider);

      const { redirect_uri, state } = this.$route.query;

      const idToken = await firebase
        .auth()
        .currentUser.getIdToken(/* forceRefresh */ true);
      // const uid = user.uid;

      const authCode = idToken;
      console.log('authCode', authCode, 'user', user);

      if (user && redirect_uri && state) {
        const uri = url.parse(redirect_uri, true);
        delete uri.search;
        uri.query.state = state;
        uri.query.code = authCode;

        const alRedirectURL = url.format(uri);
        window.location = alRedirectURL;
      } else if (user) {
        this.$router.replace(redirect || '/');
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
