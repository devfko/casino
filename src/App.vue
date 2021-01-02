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
          <v-tab to="#">Estadisticas</v-tab>
        </v-tabs>
      </template>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <!-- <HelloWorld/> -->
      <router-view></router-view>
      <!-- <Usuario :userData="userLogged" /> -->

      <hr />

      <!-- <Juego/> -->
    </v-main>
  </v-app>
</template>

<script>
// import Usuario from './pages/Usuario';
// import Juego from './pages/Juego';

export default {
  name: 'App',

  components: {
    // Usuario,
    // Juego
  },

  data: () => ({
    //
  }),
  beforeMount() {
    this.$store.dispatch('getUserLogged');
  },
};
</script>
