<template>
    <v-container grid-list-lg>
        <v-layout wrap>
            <v-spacer/>
            <v-flex xs12 sm6>
                <v-card>
                    <v-card-title>
                        Find next available departures
                    </v-card-title>
                    <v-card-text>
                        <v-combobox color="purple accent-2"
                            :value="selectedRoute" outlined
                            dense label="Select Route" :items="routes"
                            return-object clearable @input="updateSelectedRoute"
                        >
                            <template v-slot:item="{ item }">
                                {{ item.name || '' }}
                            </template>
                            <template v-slot:selection="{ item }">
                                {{ item.name || '' }}
                            </template>
                        </v-combobox>
                        <v-combobox  color="purple accent-2"
                            v-show="selectedRoute !== ''"
                            :disabled="selectedRoute === ''"
                            :value="selectedDirection" outlined
                            dense label="Select Deirection" :items="directions"
                            return-object clearable @input="updateSelectedDirection"
                        >
                            <template v-slot:item="{ item }">
                                {{ item.name || '' }}
                            </template>
                            <template v-slot:selection="{ item }">
                                {{ item.name || '' }}
                            </template>
                        </v-combobox>
                        <v-combobox  color="purple accent-2"
                            v-show="selectedDirection !== ''"
                            :disabled="selectedRoute === '' || selectedDirection === ''"
                            :value="selectedVehicle" outlined
                            dense label="Select Vehicle" :items="vehicles"
                            return-object clearable @input="updateSelectedVehicle"
                        >
                            <template v-slot:item="{ item }">
                                {{ item.name || '' }}
                            </template>
                            <template v-slot:selection="{ item }">
                                {{ item.name || '' }}
                            </template>
                        </v-combobox>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-spacer/>
        </v-layout>
    </v-container>


</template>

<script>
  export default {
    name: 'Home',

    components: {
        
    },

    methods: {
        updateSelectedRoute(event) {
            console.log(event);
            if (event === null) {
                this.selectedRoute = '';
                this.selectedDirection = '';
                this.selectedVehicle = '';
            } else {
                this.selectedRoute = event;
            }
        },
        updateSelectedDirection(event) {
            if (event === null) {
                this.selectedDirection = '';
                this.selectedVehicle = '';
            } else {
                this.selectedDirection = event;
            }
        },
        updateSelectedVehicle(event) {
            if (event === null) {
                this.selectedVehicle = '';
            } else {
                this.selectedVehicle = event;
            }
        },
    },

    data: () => ({
        routes: [
            {
                name: 'First Route',
                value: 'First Route'
            },
            {
                name: 'Second Route',
                value: 'Second Route'
            },
            {
                name: 'Third Route',
                value: 'Third Route'
            },
        ],

        directions: [
            {
                name: 'Northbound',
                value: 'Northbound'
            },
            {
                name: 'Southbound',
                value: 'Southbound'
            }
        ],

        vehicles: [
            {
                name: 'Metro A',
                value: 'Metro A'
            },
            {
                name: 'Metro B',
                value: 'Metro B'
            },
            {
                name: 'Metro C',
                value: 'Metro C'
            },
            {
                name: 'Metro D',
                value: 'Metro D'
            },
            {
                name: 'Metro E',
                value: 'Metro E'
            },
        ],

        selectedRoute: '',
        selectedDirection: '',
        selectedVehicle: ''
    })
  }
</script>
