<template>
    <v-container fluid>

        <v-container fluid >
            <v-row>
                <v-col cols="12">
                    <div class="text-center">
                        <v-chip class="ma-2" color="primary" v-if="counting" >
                            <countdown ref="countdown" v-if="counting" :time="timeCounter" @end="stopCountTime" >
                                <template slot-scope="props">
                                    Time Remaining {{ props.minutes }} minutes, {{ props.seconds }} seconds.
                                </template>
                            </countdown>
                        </v-chip>
                    </div>
                </v-col>
                <v-col cols="12" v-if="idTable">
                    <div class="text-center">
                        <v-btn @click.prevent="leaveGame()" color="danger">
                            <v-icon>mdi-exit-run</v-icon>
                            Abandonar Juego
                        </v-btn>
                    </div>
                </v-col>
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
                        
                        <v-chip class="ma-2" :color="balanceColor">
                            <v-icon>mdi-cash</v-icon>
                            Saldo $ {{ Math.floor(userLogged.balance) }}
                        </v-chip>

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
                                <v-chip  class="ma-2 chip-table" color="green" text-color="white" v-if="idTable">
                                    <span>{{tableName}}</span>
                                </v-chip>
                                <base-radio :description="'Selecciona el color de la apuesta'" :items="arrItems" @value="changeRadio">
                                </base-radio>
                            </v-row>
                                
                            <v-row align="center" justify="center" v-if="idTable" no-gutters>
                                <v-col cols="4" md="4">
                                    <v-text-field style="width: 80%" type="number" v-model="valueBet" :disabled="fixedValue"></v-text-field>
                                </v-col>
                                <v-col cols="8" md="8">
                                    <v-btn depressed color="primary" @click.prevent="makeBet()" :disabled="!availableBalance || isBet">
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
                            
                            <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="10" v-if="isBet"></v-progress-linear>

                        </v-card-actions>

                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-alert dense border="left" :type="typeAlert" dark v-if="message">
                        {{message}}
                    </v-alert>
                </v-col>
                <v-col cols="12">
                    <v-card min-width="600px" max-width="800px" class="mx-auto">
                        <Datatable :items="arrBets" />
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

    </v-container>
</template>

<script>
import Countdown from '@chenfengyuan/vue-countdown';
import BaseRadio from './../components/RadioButton';
import Datatable from './../layout/DataTable';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            idTable: null,
            idChair: null,
            resultBet: null,
            message: null,
            arrItems: [],
            arrBets: [],
            infoChair: [],
            infoTable: {},
            tableName: '',
            typeBet: '',
            typeAlert: 'info',
            availableBalance: true,
            counting: false,
            fixedValue: false,
            isBet: false,
            startTime: false,
            valueBet: 0,
            minimumBet: parseFloat(process.env.VUE_APP_MINIMUM_BET),
            timeCounter: parseFloat(process.env.VUE_APP_TIMER) || 240000
        }
    },
    components: {
        BaseRadio,
        Countdown,
        Datatable
    },
    created() {
        this.counting = false;
        this.loadOptions();
        this.validateChair();
        this.validateBalance();
    },
    methods: {
        showMessage(type, message) {
            this.typeAlert = type;
            this.message = message;
        },
        async leaveGame() {
            this.counting = false;
            
            /** Crea la mesa del jugador */
            try {
                await axios.post('', {
                    query: `mutation ($chair: String!) {
                        leaveChair(idChair: $chair) {
                            id
                            state
                        }
                    }`,
                    variables: {
                        chair: this.idChair,
                    }
                })
                .then(response => {
                    // console.log({response});

                    if (response.data.errors) {
                        this.showMessage('danger', response.data.errors[0].message);
                        return;
                    }
                    
                    this.idTable = null;
                    this.idChair = null;
                    this.message = '';
                    this.validateChair();
                })
            } catch (err) {
                // console.log({err});
                this.showMessage('danger', 'No se abandonó el juego, por favor recargar e intentarlo de nuevo');
            }
        },
        initCountTime() {
            this.counting = true;
        },
        stopCountTime() {
            this.counting = false;

            if (!this.isBet) {
                let rnd = Math.floor(Math.random() * this.arrItems.length);
                this.typeBet = this.arrItems[rnd].id;
                this.valueBet = Math.floor(this.userLogged.balance * 0.11);
                this.makeBet();
            }
        },
        async validateChair() {
            /** Método que verifica si el usuario tiene una silla activa, por lo tanto, tiene un juego sin terminar */
            
            this.counting = false;
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
                        this.infoTable = this.infoChair.find(table => table.state == true);

                        if (this.infoTable !== undefined) {
                            this.idTable = this.infoTable.table.id;
                            this.idChair = this.infoTable.id;
                            this.tableName = this.infoTable.table.name;
                            // this.initCountTime();
                        }
                    }
                })
            } catch (err) {
                this.showMessage('danger', 'No se pudo validar el estado previo del juego, por favor recargar e intentarlo de nuevo');
            }
        },
        async loadOptions() {
            /** Método que carga las opciones de apuestas (colores) */
            this.isLoading = true;
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
                    this.arrItems = response.data.data.allColors;
                })
            } catch (err) {
                this.showMessage('danger', 'No se obtuvieron las opciones de apuestas, por favor recargar e intentarlo de nuevo');
            }
            this.isLoading = false;
        },
        changeRadio(value) {
            /** Captura la opción seleccionada */
            this.typeBet = value
        },
        async createTable() {
            /** Crea la mesa del jugador */

            if (this.userLogged.balance == 0 ) {
                this.showMessage('warning', 'No tienes saldo para jugar!');
                return;
            }

            if (this.userLogged.balance < this.minimumBet) {
                this.showMessage('warning', `Debes tener saldo minimo de ${this.minimumBet} para unirte a una mesa!`);
                return;
            }

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
                        this.showMessage('danger', response.data.errors[0].message);
                        return;
                    }
                    this.idTable = response.data.data.addTable.id;
                    this.idChair = response.data.data.addTable.chairs[0].id;
                    this.tableName = response.data.data.addTable.name;
                    /** Inicia contador */
                    this.initCountTime();
                })
            } catch (err) {
                this.showMessage('danger', 'No se creó el juego, por favor recargar e intentarlo de nuevo');
            }
        },
        async makeBet() {
                        
            /** Método que realiza las apuestas sobre la mesa creada o existente */
            if (this.typeBet == '') {
                this.showMessage('warning', 'Debe Seleccionar un color para apostar');
                return;
            }

            if (!this.fixedValue && ( this.valueBet < Math.floor(this.userLogged.balance * 0.11) || ( this.valueBet > Math.floor(this.userLogged.balance * 0.19))) ) {
                this.showMessage('warning', `El Rango de la apuesta debe ser entre ${Math.floor(this.userLogged.balance * 0.11)} y ${Math.floor(this.userLogged.balance * 0.19)}`);
                return;
            }

            /** Detiene contador, mientras se realiza la apuesta */
            this.isBet = true;
            this.stopCountTime();
            this.availableBalance = false;

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
                        color: this.typeBet,
                        value: parseFloat(this.valueBet)
                    }
                })
                .then(response => {
                    // console.log({response});

                    if (response.data.errors) {
                        this.showMessage('danger', response.data.errors[0].message);
                        return;
                    }

                    if (response.data.data.addBet.resultColor.id === this.typeBet) {
                        this.showMessage('success', 'Felicitaciones, Acertaste, Vamos por más!! :)');
                    } else {
                        this.showMessage('warning', 'Que falla, no acertaste!!');
                    }

                    this.resultBet = response.data.data.addBet;
                    console.log(this.typeBet);
                    this.arrBets.push(JSON.parse(JSON.stringify(this.resultBet)));
                    this.userLogged.balance += (response.data.data.addBet.profit - this.valueBet);
                    this.typeBet = '';
                    this.validateBalance();
                })
            } catch (err) {
                this.showMessage('danger', 'No se realizó la apuesta, por favor recargar e intentarlo de nuevo');
            }
            
            this.isBet = false;
            
            /** Se inicia nuevamente el contador */
            this.initCountTime();
        },
        validateBalance() {
            /** Método que valida el saldo existente luego de la apuesta */

            if (this.userLogged.balance > 0 && this.userLogged.balance <= 1000) {
                this.fixedValue = true;
                this.valueBet = this.userLogged.balance;
            }

            if (this.userLogged.balance <= 0) {
                this.availableBalance = false;
            } else {
                this.availableBalance = true;
            }

            if (this.idTable != null && this.availableBalance) this.initCountTime();
        }
    },
    computed: {
        ...mapGetters({
            userLogged: 'userLogged'
        }),
        balanceColor() {
            return (this.availableBalance) ? "white" : "red";
        }
    }
}
</script>

<style scoped>
    .chip-table span{
        width: 100px;
        text-align: center;
        justify-content: center;
    }
    
</style>