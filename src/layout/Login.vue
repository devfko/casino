<template>
    <v-dialog v-model="show" persistent>
        <v-main>
            <v-container fluid style="background: white">
                <v-row align="center" justify="center">
                    <v-col cols="12" sm="9" md="6">
                        <v-card>
                            <v-toolbar>
                                <v-toolbar-title>Ingreso</v-toolbar-title>                                
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
                </v-row>
            </v-container>
        </v-main>
    </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
    name: 'LoginForm',
    data() {
        return {
            username: null,
            password: null
        }
    },
    methods: {
        async login() {

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
                    this.$store.dispatch('saveUserLogged', response.data.data.loginUser);
                    this.$router.push({path: '/user'});
                    this.$emit('close', this.value);
                })
            } catch (err) {
                console.error({err});
            }

        },
        cancel() {
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