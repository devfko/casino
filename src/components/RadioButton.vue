<template>
    <v-container fluid v-if="items">
        <v-radio-group>
            <template v-slot:label>
                <span style="font-size:18px; font-weight: bold">{{description}}</span>
            </template>
            <v-radio v-for="item in items" :key="item.id" :value="item.name" @change="updateValue(item.id)">
                <template v-slot:label>
                    <span>{{item.name}}</span>
                </template>
            </v-radio>
        </v-radio-group>
    </v-container>
</template>

<script>
export default {
    name: "base-radio",
    props: {
        description: {
            type: String,
            required: true
        },
        items: {
            type: Array,
            required: true
        }
    },
    methods: {
        updateValue(value) {
            this.$emit('value',value);
        }
    }
}
</script>

<style>

</style>