<template>
    <v-dialog v-model="show" persistent style="max-width: 600px;">
        <v-container fluid style="background: white; max-width: 600px;">
            <v-row align="center" justify="center">
                <v-col cols="12" sm="12" md="12">
                    <v-card>
                        <v-toolbar>
                            <v-toolbar-title>Acceso Usuarios</v-toolbar-title>
                        </v-toolbar>
                    </v-card>
                    <v-card-text>
                        <v-form>
                            <v-text-field label="Login" name="login" prepend-icon="mdi-account" type="text" v-model="username"></v-text-field>
                            <v-text-field id="password" label="Password" name="password" prepend-icon="mdi-lock" type="password" v-model="password"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="login()" color="success">Login</v-btn>
                        <v-btn @click="cancel()">Cancelar</v-btn>
                    </v-card-actions>
                </v-col>
                <v-col cols="12" v-if="message">
                    <div class="text-center">
                        <v-chip color="red">{{message}}</v-chip>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
    name: 'LoginForm',
    data() {
        return {
            username: null,
            password: null,
            message: ''
        }
    },
    methods: {
        async login() {

            if (this.username == null || this.password == null)  return;

            try {
                await axios.post('', {
                    query: `query ($username: String!, $password: String!) {
                        loginUser(username: $username, password: $password) {
                            id
                            name
                            lastname
                            username
                            password
                            balance
                        }
                    }`,
                    variables: {
                        username: this.username,
                        password: this.password
                    }
                })
                .then(response => {
                    // console.log({response});

                    if (response.data.data.errors) {
                        this.message = response.data.data.errors[0].message;
                        return;
                    }

                    if (response.data.data.loginUser == null) {
                        this.message = 'Usuario y/o contraseña incorrectas!';
                        return;
                    }

                    this.$store.dispatch('saveUserLogged', response.data.data.loginUser);
                    this.$router.push({path: '/user'});
                    this.$emit('close', this.value);
                })
            } catch (err) {
                this.message = 'No se pudo realizar login, por favor recargue e intentelo nuevamente';
                // console.error({err});
            }

        },
        cancel() {
            this.username = null;
            this.password = null;
            this.message = '';
            this.$emit('close', this.value);
        }
    },
    props: {
        value: Boolean
    },
    computed: {
        show: {
            get () {
                return this.value;
            },
            set (value) {
                this.$emit('close', value);
            }
        }
    }
}
</script>

<style>

</style>