<template>
    <v-container fluid>
        
        <content-buttons v-if="!userLogged"/>

        <v-container fluid v-else>
            <v-row>
                <v-col cols="12">
                    <v-card min-width="600px" max-width="800px" class="mx-auto">
                    <v-card-title>
                        <v-icon>mdi-account-circle</v-icon>
                        {{ userLogged.name }} {{ userLogged.lastname }}
                    </v-card-title>

                    <v-card-subtitle>
                        <v-icon>mdi-key</v-icon>
                        {{ userLogged.username }} - {{ userLogged.id }}
                    </v-card-subtitle>
                    
                    <v-card-text>
                        <v-icon>mdi-cash</v-icon>
                        Saldo $ {{ userLogged.balance }}
                    </v-card-text>

                    <v-divider class="mx-4"></v-divider>

                    <v-card-text>
                        <v-row align="center" justify="center" v-if="!idTable">
                            <v-btn depressed color="success" @click="createTable()" >
                                <v-icon left>
                                    mdi-table
                                </v-icon>
                                Unirse a una mesa!
                            </v-btn>
                        </v-row>
                        <v-row align="center" justify="center">
                            <v-chip class="ma-2" color="green" text-color="white" v-if="idTable">
                                {{tableName}}
                            </v-chip>
                            <base-radio :description="'Selecciona el color de la apuesta'" :items="arrItems" @value="changeRadio">
                            </base-radio>
                        </v-row>
                        <v-row align="center" justify="center" v-if="idTable" no-gutters>
                            <v-col cols="4" md="4">
                                <v-text-field style="width: 80%" type="number" v-model="valueBet"></v-text-field>
                            </v-col>
                            <v-col cols="8" md="8">
                                <v-btn depressed color="primary" @click="makeBet()" :disabled="!saldoDisponible">
                                    <v-icon left>
                                        mdi-cash
                                    </v-icon>
                                    Apostar!
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    
                    <v-divider class="mx-4"></v-divider>

                    <v-card-actions>
                        <v-progress-linear
                            color="deep-purple accent-4"
                            indeterminate
                            rounded
                            height="10" v-show="isBet">
                        </v-progress-linear>

                        <v-card-text>
                            <span>Opción Seleccionada : {{ valueRadio }}</span>
                            <span>Opción Resultado : {{ resultadoApuesta }}</span>
                        </v-card-text>
                    </v-card-actions>


                </v-card>
                </v-col>
                <v-col>
                    <v-alert dense border="left" type="warning" dark v-if="message">
                        {{message}}
                    </v-alert>
                </v-col>
            </v-row>
        </v-container>

    </v-container>
</template>

<script>
import BaseRadio from './../components/RadioButton';
import ContentButtons from './../layout/Content';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            idTable: null,
            arrItems: [],
            valueRadio: '',
            isBet: false,
            valueBet: 0,
            resultadoApuesta: null,
            tableName: '',
            infoChair: [],
            infoTable: {},
            message: null,
            saldoDisponible: true
        }
    },
    components: {
        BaseRadio,
        ContentButtons
    },
    created() {
        this.loadOptions();
        this.validateChair();
    },
    methods: {
        async validateChair() {
            try {
                await axios.post('', {
                    query: `query info($id: ID!){
                        getUserById(id: $id) {
                            id
                            name
                            chairs{
                                id
                                state
                                table{
                                    id
                                    name
                                }
                            }
                        }
                    }`,
                    variables: {
                        id: this.userLogged.id
                    }
                })
                .then(response => {
                    // console.log({response});

                    this.infoChair = response.data.data.getUserById.chairs;

                    if (this.infoChair.length > 0) {
                        this.infoTable = this.infoChair.filter(table => table.state && table.table);
                        this.idTable = this.infoTable[0].table.id;
                        this.tableName = this.infoTable[0].table.name;
                    }
                    // console.log(result);
                })
            } catch (err) {
                this.message = 'No se pudo validar el estado previo del juego, por favor recargar e intentarlo de nuevo';
                // console.error({err});
            }
        },
        async loadOptions() {
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
                    // console.log({response});

                    this.arrItems = response.data.data.allColors;
                })
            } catch (err) {
                this.message = 'No se obtuvieron las opciones de apuestas, por favor recargar e intentarlo de nuevo';
                // console.error({err});
            }
        },
        changeRadio(value) {
            this.valueRadio = value
        },
        async createTable() {

            try {
                await axios.post('', {
                    query: `mutation ($username: String!) {
                        addTable(username: $username) {
                            id
                            name
                            chairs {
                                id
                            }
                        }
                    }`,
                    variables: {
                        username: this.userLogged.id,
                    }
                })
                .then(response => {
                    // console.log({response});

                    if (response.data.errors) {
                        this.message = response.data.errors[0].message;
                        return;
                    }
                    this.idTable = response.data.data.addTable.id;
                    this.tableName = response.data.data.addTable.name;

                })
            } catch (err) {
                this.message = 'No se creó el juego, por favor recargar e intentarlo de nuevo';
                //console.error({err});
            }
        },
        async makeBet() {

            if ( this.valueBet < (this.userLogged.balance * 0.11) || ( this.valueBet > (this.userLogged.balance * 0.19)) ) {
                this.message = `El Rango de la Apuesta debe ser entre ${ this.userLogged.balance * 0.11} y ${this.userLogged.balance * 0.19}`;
                return;
            }

            try {
                await axios.post('', {
                    query: `mutation ($username: String!, $table: String!, $color: String!, $value: Float!) {
                        addBet(username: $username, table: $table, color: $color, value: $value) {
                            id
                            value
                            profit
                            resultColor{
                                id
                                name
                            }
                        }
                    }`,
                    variables: {
                        username: this.userLogged.id,
                        table: this.idTable,
                        color: this.valueRadio,
                        value: parseFloat(this.valueBet)
                    }
                })
                .then(response => {
                    // console.log({response});

                    if (response.data.errors) {
                        this.message = response.data.errors[0].message;
                        return;
                    }

                    if (response.data.data.addBet.resultColor.id === this.valueRadio) {
                        this.message = 'Ganaste!! :)';
                    } else {
                        this.message = 'Perdiste!! :(';
                    }
                    this.userLogged.balance += (response.data.data.addBet.profit - this.valueBet);
                })
            } catch (err) {
                this.message = 'No se realizó la apuesta, por favor recargar e intentarlo de nuevo';
                // console.error({err});
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