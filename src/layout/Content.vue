<template>
    <v-container fluid style="max-width: 200px">
        <v-row>
            <v-btn block width="100%" depressed color="success" @click="login()">
                <v-icon left>
                    mdi-login
                </v-icon>
                Iniciar Sesión
            </v-btn>
            <v-btn block width="100%" depressed color="primary" @click="signup()">
                <v-icon left>
                    mdi-new-box
                </v-icon>
                Registrarse
            </v-btn>
        </v-row>
        <login-form v-model="isLogin" @close="closeLogin" />
    </v-container>
</template>

<script>
import LoginForm from './Login';

export default {
    data() {
        return {
            isLogin: false,
        }
    },
    components: {
        LoginForm
    },
    methods: {
        closeLogin() {
            this.isLogin = false;
        },
        login() {
            this.isLogin = true;
        },
        signup() {
            this.$router.push({path: '/user'});
        }
    }
}
</script>

<style>
    .container--fluid {
        height: 100%;
        display: flex;
    }
    .container--fluid {
        justify-items: center;
        align-items: center;
    }
    .container--fluid .v-btn{
        margin-bottom: 5px;
    }
</style>