<template>
    <v-container fluid>
        <v-row>
            <v-col class="mb-8">
                <label>{{ valueRadio }}</label>
            </v-col>
            <v-col class="mb-4">
                <base-radio :description="'Selecciona el color de la apuesta'" :items="arrItems" @value="changeRadio">
                </base-radio>
            </v-col>
            <!-- [{'name': 'Verde', id: 1}, {'name': 'Rojo', id: 2}, {'name': 'Negro', id: 3}] -->
        </v-row>
        <v-divider></v-divider>
        <v-row align="center" justify="center">
            <v-btn depressed color="success" @click="crearMesa()" v-if="!idMesa">
                <v-icon left>
                    mdi-table
                </v-icon>
                Unirse a una mesa!
            </v-btn>
            <v-btn depressed color="primary" @click="hacerApuesta()" v-else>
                <v-icon left>
                    mdi-cash-check
                </v-icon>
                Apostar!
            </v-btn>
        </v-row>
    </v-container>
</template>

<script>
import BaseRadio from './../components/RadioButton';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            idMesa: null,
            arrItems: [],
            valueRadio: ''
        }
    },
    components: {
        BaseRadio
    },
    created() {
        this.cargarOpciones();
    },
    methods: {
        async cargarOpciones() {
            try {
                await axios.post('', {
                    query: `{
                        allColors {
                            id
                            name
                            percentaje
                            gain
                        }
                    }`
                })
                .then(response => {
                    console.log({response});

                    this.arrItems = response.data.data.allColors;
                })
            } catch (err) {
                console.error({err});
            }
        },
        changeRadio(value) {
            this.valueRadio = value
        },
        async crearMesa() {
            alert('Creando mesa. . . ');

            try {
                await axios.post('', {
                    query: `mutation ($user: String!) {
                        addTable(user: $user) {
                            id
                            name
                            chairs {
                                id
                            }
                        }
                    }`,
                    variables: {
                        user: this.userLogged.id,
                    }
                })
                .then(response => {
                    console.log({response});

                    if (response.data.errors) {
                        this.message = response.data.errors[0].message;
                        return;
                    }

                })
            } catch (err) {
                console.error({err});
            }
        },
        hacerApuesta() {
            alert('Apostando. . . ');
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