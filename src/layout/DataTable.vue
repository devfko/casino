<template>    
    <v-data-table :headers="headers" :items="items" :items-per-page="5" class="elevation-1">
    </v-data-table>
</template>

<script>
export default {
    name: 'Datatable',
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            headers: [
                { text: 'Color Apostado', align: 'start', value: 'color'},
                { text: 'Valor Apostado', align: 'end', value: 'value'},
                { text: 'Color Resultado', align: 'start', value: 'resultColor.name'},
                { text: 'Ganancia Obtenida', align: 'end', value: 'profit'},
            ],
        }
    }
}
</script>

<style>
    .modal-backdrop {
        position: fixed;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        /* background: #FFFFFF; */
        background: rgb(228, 228, 228, 0.6);
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
    }

    .modal-header,
    .modal-footer {
        padding: 15px;
        display: flex;
    }

    .modal-header {
        border-bottom: 1px solid #eeeeee;
        color: #4AAE9B;
        justify-content: space-between;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .modal-fade-enter,
    .modal-fade-leave-active {
        opacity: 0;
    }

    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity .5s ease
    }

</style>