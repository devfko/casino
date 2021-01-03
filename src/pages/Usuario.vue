<template>
    <v-container style="width: 400px">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="idUsuario" disabled></v-text-field>
            <v-text-field v-model="name" counter maxlength="20" :rules="[namesRules.required, namesRules.min]" label="Nombre" required></v-text-field>
            <v-text-field v-model="lastname" counter maxlength="20" :rules="[namesRules.required, namesRules.min]" label="Apellido" required></v-text-field>
            <v-text-field v-model="username" counter maxlength="20" :rules="[userRules.required, userRules.min]" label="Usuario" required></v-text-field>
            <v-text-field v-model="password" counter maxlength="15" :rules="[passRules.required, passRules.min]" label="Password" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" @click:append="showPass = !showPass" required></v-text-field>
            <v-text-field v-model="balance" type="number" label="Saldo"></v-text-field>
        </v-form>

        <v-row align="center" justify="center">
            <v-btn depressed color="primary" v-if="!userLogged" @click="saveUser()">
                <v-icon left>
                    mdi-content-save
                </v-icon>
                Guardar
            </v-btn>
            <v-btn depressed color="warning" v-else @click="editUser()">
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
    data() {
        return {
            valid: true,
            showPass: false,
            idUsuario: '',
            name: '',
            lastname: '',
            username: '',
            namesRules: {
                required: value => !!value || 'Campo Obligatorio (*)',
                min: value => value.length >= 3 || 'No puede ser inferior a 3 caracteres',
            },
            userRules: {
                required: value => !!value || 'Campo Obligatorio (*)',
                min: value => value.length >= 5 || 'No puede ser inferior a 4 caracteres',
            },
            password: '',
            passRules: {
                required: value => !!value || 'Campo Obligatorio (*)',
                min: value => value.length >= 8 || 'Debe tener minimo 8 caracteres'
            },
            balance: 0,
            message: null
        }
    },
    methods: {
        async saveUser() {
            
            if (!this.$refs.form.validate()) return;

            this.message = null;

            try {
                await axios.post('', {
                    query: `mutation ($name: String!, $lastname: String!, $username: String!, $password: String!, $saldo: Float) {
                        addUser(name: $name, lastname: $lastname, username: $username, password: $password, balance: $saldo) {
                            id
                            name
                            lastname
                            username
                            balance
                        }
                    }`,
                    variables: {
                        name: this.name,
                        lastname: this.lastname,
                        username: this.username,
                        password: this.password,
                        saldo: parseFloat(this.balance)
                    }
                })
                .then(response => {
                    // console.log({response});

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
        async editUser() {

            this.message = null;

            if (!this.$refs.form.validate()) return;

            try {
                await axios.post('', {
                    query: `mutation ($id: ID!, $name: String!, $lastname: String!, $username: String!, $password: String!, $saldo: Float) {
                        editUser(id: $id, name: $name, lastname: $lastname, username: $username, password: $password, balance: $saldo) {
                            id
                            name
                            lastname
                            username
                            balance
                        }
                    }`,
                    variables: {
                        id: this.idUsuario,
                        name: this.name,
                        lastname: this.lastname,
                        username: this.username,
                        password: this.password,
                        saldo: parseFloat(this.balance)
                    }
                })
                .then(response => {
                    // console.log({response});

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
        },
        loadUser() {
            this.idUsuario = this.userLogged.id;
            this.name = this.userLogged.name;
            this.lastname = this.userLogged.lastname;
            this.username = this.userLogged.username;
            this.balance = this.userLogged.balance;
        }
    },
    created() {
        if (this.userLogged) this.loadUser();
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