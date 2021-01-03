<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <template>
        <v-tabs>
          <v-tab to="/game">Juego</v-tab>
          <v-tab to="/user">Usuario</v-tab>
          <!-- <v-tab to="#">Estadisticas</v-tab> -->
        </v-tabs>
      </template>

      <v-spacer></v-spacer>

      <v-btn class="white--text" depressed v-if="userLogged" @click="logout()">
        <v-icon>mdi-logout</v-icon>
        Log Out
      </v-btn>
      
    </v-app-bar>

    <v-main>
      <router-view></router-view>      
    </v-main>

    <v-footer padless>
      <v-card flat tile width="100%" class="text-center" color="primary">
        <v-card-text class="white--text">
          <v-btn depressed href="https://www.instagram.com/devfko" target="_blank">
            @devfko
            <v-icon>mdi-instagram</v-icon> 
          </v-btn>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  data: () => ({
  }),
  beforeMount() {
    this.$store.dispatch('getUserLogged');
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
  computed: {
    ...mapGetters({
      userLogged: 'userLogged'
    })
  }
};
</script>