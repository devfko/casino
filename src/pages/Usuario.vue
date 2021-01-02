<template>
    <v-container style="width: 400px">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="idUsuario" disabled></v-text-field>
            <v-text-field v-model="name" counter maxlength="20" :rules="[namesRules.required, namesRules.min]" label="Nombre" required></v-text-field>
            <v-text-field v-model="lastname" counter maxlength="20" :rules="[namesRules.required, namesRules.min]" label="Apellido" required></v-text-field>
            <v-text-field v-model="user" counter maxlength="20" :rules="[userRules.required, userRules.min]" label="Usuario" required></v-text-field>
            <v-text-field v-model="password" counter maxlength="15" :rules="[passRules.required, passRules.min]" label="Password" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" @click:append="showPass = !showPass" required></v-text-field>
            <v-text-field v-model="balance" type="number" label="Saldo"></v-text-field>
        </v-form>

        <v-row align="center" justify="center">
            <v-btn depressed color="primary" v-if="!userData" @click="guardarUsuario()">
                <v-icon left>
                    mdi-content-save
                </v-icon>
                Guardar
            </v-btn>
            <v-btn depressed color="warning" v-else @click="editarUsuario()">
                <v-icon left>
                    mdi-pencil
                </v-icon>
                Editar
            </v-btn>
        </v-row>

        <v-row style="margin-top: 30px">
            <v-alert dense border="left" type="warning" dark v-if="message">
                {{message}}
            </v-alert>
        </v-row>

    </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
    props: {
        userData: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            valid: true,
            showPass: false,
            idUsuario: (this.userData) ? this.userData.id : '',
            name: (this.userData) ? this.userData.name : '',
            lastname: (this.userData) ? this.userData.lastname : '',
            user: (this.userData) ? this.userData.user : '',
            namesRules: {
                required: value => !!value || 'Campo Obligatorio (*)',
                min: value => value.length >= 3 || 'No puede ser inferior a 3 caracteres',
            },
            userRules: {
                required: value => !!value || 'Campo Obligatorio (*)',
                min: value => value.length >= 5 || 'No puede ser inferior a 4 caracteres',
            },
            password: (this.userData) ? this.userData.password : '',
            passRules: {
                required: value => !!value || 'Campo Requerido',
                min: value => value.length >= 8 || 'Debe tener minimo 8 caracteres'
            },
            balance: (this.userData) ? this.userData.balance : 0,
            message: null
        }
    },
    methods: {
        async guardarUsuario() {
            
            this.message = null;

            try {
                await axios.post('', {
                    query: `mutation ($name: String!, $lastname: String!, $user: String!, $password: String!, $saldo: Float) {
                        addUser(name: $name, lastname: $lastname, user: $user, password: $password, balance: $saldo) {
                            id
                            name
                            lastname
                            user
                            balance
                        }
                    }`,
                    variables: {
                        name: this.name,
                        lastname: this.lastname,
                        user: this.user,
                        password: this.password,
                        saldo: parseFloat(this.balance)
                    }
                })
                .then(response => {
                    console.log({response});

                    if (response.data.errors) {
                        this.message = response.data.errors[0].message;
                        return;
                    }

                    this.$store.dispatch('saveUserLogged', response.data.data.addUser);
                    this.$router.push({path: '/game'});

                })
            } catch (err) {
                console.error({err});
            }
        },
        async editarUsuario() {
            this.message = null;

            try {
                await axios.post('', {
                    query: `mutation ($id: ID!, $name: String!, $lastname: String!, $user: String!, $password: String!, $saldo: Float) {
                        editUser(id: $id, name: $name, lastname: $lastname, user: $user, password: $password, balance: $saldo) {
                            id
                            name
                            lastname
                            user
                            balance
                        }
                    }`,
                    variables: {
                        id: this.idUsuario,
                        name: this.name,
                        lastname: this.lastname,
                        user: this.user,
                        password: this.password,
                        saldo: parseFloat(this.balance)
                    }
                })
                .then(response => {
                    console.log({response});

                    if (response.data.errors) {
                        this.message = response.data.errors[0].message;
                        return;
                    }

                    this.$store.dispatch('saveUserLogged', response.data.data.editUser);
                    this.$router.push({path: '/game'});
                })
            } catch (err) {
                console.error({err});
            }
        }
    },
    computed: {
        ...mapGetters({
            userLogged: 'userLogged'
        })
    }
}
</script>

<style>

</style>