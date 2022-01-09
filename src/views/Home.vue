<template>
    <v-container grid-list-lg>
        <v-layout wrap>
            <v-spacer/>
            <v-flex xs12 sm10 md8 lg8 xl6>
                <v-card class="rounded-xl" flat color="transparent">
                    <v-card-title class="text-h5 font-weight-bold justify-center">
                        Find your next departure. 
                    </v-card-title>
                    <v-card-text class="text-center pb-1">
                        <v-btn-toggle 
                            v-model="findDeparturesByRoute" 
                            color="purple accent-2" 
                            rounded mandatory
                            :dense="$vuetify.breakpoint.xs"
                        >
                            <v-btn
                                class="font-weight-bold" 
                                text color="purple accent-2"
                                :value="true"
                            >
                                <span :class="$vuetify.theme.dark ? 'white--text' : 'black--text'">By Route</span>
                            </v-btn>
                            <v-btn
                                class="font-weight-bold"
                                text color="purple accent-2"
                                :value="false"
                            >
                                <span :class="$vuetify.theme.dark ? 'white--text' : 'black--text'">By Stop #</span>
                            </v-btn>
                        </v-btn-toggle>
                    </v-card-text>
                    <v-fade-transition leave-absolute hide-on-leave>
                        <v-card-text v-if="findDeparturesByRoute">
                            <v-select color="purple accent-2" menu-props="offsetY"
                                :value="selectedRoute" outlined
                                :dense="$vuetify.breakpoint.xs" label="Select Route" :items="routes"
                                return-object clearable @input="updateSelectedRoute"
                                item-color="purple accent-2" hide-details
                                item-text="route_label" item-value="route_id" class="rounded-xl mb-5"
                            >
                            </v-select>
                            <v-fade-transition>
                                <v-select color="purple accent-2" menu-props="offsetY"
                                    v-show="selectedRoute !== ''"
                                    :disabled="selectedRoute === ''"
                                    :value="selectedDirection" outlined
                                    :dense="$vuetify.breakpoint.xs" label="Select Direction" :items="directions"
                                    return-object clearable @input="updateSelectedDirection"
                                    item-color="purple accent-2" hide-details
                                    item-text="direction_name" item-value="direction_id" class="rounded-xl mb-5"
                                >
                                </v-select>
                            </v-fade-transition>
                            <v-fade-transition>
                                <v-select color="purple accent-2" menu-props="offsetY"
                                    v-show="selectedDirection !== ''"
                                    :disabled="selectedRoute === '' || selectedDirection === ''"
                                    :value="selectedStop" outlined
                                    :dense="$vuetify.breakpoint.xs" label="Select Stop" :items="stops"
                                    return-object clearable @input="updateSelectedStop"
                                    item-color="purple accent-2"
                                    item-text="description" item-value="stop_id"
                                    hide-details class="rounded-xl mb-3"
                                >
                                </v-select>
                            </v-fade-transition>
                        </v-card-text>
                    </v-fade-transition>
                    <v-fade-transition leave-absolute hide-on-leave>
                        <v-card-text v-if="!findDeparturesByRoute">
                            <v-layout>
                                <v-flex grow>
                                    <v-text-field color="purple accent-2"
                                        v-model="searchForStopNumber" outlined
                                        :dense="$vuetify.breakpoint.xs" 
                                        label="Enter Stop #" clearable
                                        hide-details class="rounded-xl mb-5"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex shrink>
                                    <v-btn
                                        icon fab text
                                        :small="$vuetify.breakpoint.xs" 
                                        color="purple accent-2"
                                        @click="updateSearchForStopNumber"
                                    >
                                        <v-icon :large="!$vuetify.breakpoint.xs">mdi-magnify</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-fade-transition>
                    <v-fade-transition group>
                        <v-divider v-show="Object.keys(nexTripResult).length > 0" :key="1"/>
                        <v-card-title v-show="Object.keys(nexTripResult).length > 0" :key="2" class="mt-1">
                            <v-layout wrap justify-space-between align-center>
                                <v-flex shrink v-show="selectedStopDescription !== ''">
                                    <span class="text-h5 font-weight-bold">{{ selectedStopDescription }}</span>
                                </v-flex>
                                <v-flex shrink v-show="selectedStopNumber !== ''">
                                    <span class="subtitle-1">{{ selectedStopNumber }}</span>
                                </v-flex>
                            </v-layout>
                        </v-card-title>
                    </v-fade-transition>
                    <v-fade-transition>
                        <v-card-text v-show="Object.keys(nexTripResult).length > 0">
                            <v-layout wrap justify-center>
                                <v-flex shrink v-for="(alert, index) in nexTripResult.alerts" :key="index">
                                    <v-alert
                                        dense text class="rounded-xl mb-2"
                                        :type="alert.stop_closed ? 'error' : 'info'"
                                        :icon="alert.stop_closed ? 'mdi-alert-octagon' : 'mdi-alert-circle'"
                                    >
                                        <span :class="$vuetify.breakpoint.xs ? 'caption' : ''">{{ alert.alert_text }}</span>
                                    </v-alert>
                                </v-flex>
                            </v-layout>
                            <v-layout wrap align-center justify-space-between>
                                <v-flex :grow="!$vuetify.breakpoint.xs" :xs12="$vuetify.breakpoint.xs">
                                    <v-btn v-show="nexTripResult.departures ? nexTripResult.departures.length > 0 : false"
                                        block text outlined rounded 
                                        :large="!$vuetify.breakpoint.xs" 
                                        color="purple accent-2" class="pl-1 pr-2"
                                    >
                                        <v-icon class="mr-1">mdi-magnify</v-icon>
                                        <span :class="$vuetify.theme.dark ? 'white--text' : 'black--text'">Show This Vehicle</span>
                                    </v-btn>
                                </v-flex>
                                <v-flex shrink>
                                    <v-btn-toggle 
                                        v-model="expandedDepartureTable" 
                                        rounded color="purple accent-2"
                                        :dense="$vuetify.breakpoint.xs"
                                        mandatory
                                    >
                                        <v-btn :value="false" text color="purple accent-2">
                                            <v-icon>mdi-unfold-less-horizontal</v-icon>
                                        </v-btn>
                                        <v-btn :value="true" text color="purple accent-2">
                                            <v-icon>mdi-unfold-more-horizontal</v-icon>
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-flex>
                                <v-flex shrink>
                                    <v-btn-toggle 
                                        v-model="relativeDepartureTimeText" 
                                        rounded color="purple accent-2"
                                        :dense="$vuetify.breakpoint.xs"
                                        mandatory
                                    >
                                        <v-btn :value="false" text color="purple accent-2">
                                            <v-icon>mdi-clock-time-two-outline</v-icon>
                                        </v-btn>
                                        <v-btn :value="true" text color="purple accent-2">
                                            <v-icon>mdi-timer-sand</v-icon>
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-flex>
                            </v-layout>
                            <v-card
                                outlined 
                                class="departure-table rounded-xl"
                            >
                                <v-data-table
                                    :headers="departureTableHeaders"
                                    :items="nexTripResult.departures || []"
                                    hide-default-footer class="departure-table"
                                    mobile-breakpoint="0" :dense="$vuetify.breakpoint.xs"
                                    :items-per-page="expandedDepartureTable ? -1 : 4"
                                    no-data-text="No Departures were found at this time. Please select another Route or search for another Stop#."
                                >
                                    <template v-slot:[`item.route_short_name`]="{ item }">
                                        <span :class="$vuetify.breakpoint.xs ? 'caption' : ''">
                                            {{item.route_short_name}}
                                        </span>
                                    </template>
                                    <template v-slot:[`item.description`]="{ item }">
                                        <span :class="$vuetify.breakpoint.xs ? 'caption' : ''">
                                            {{item.description}}
                                        </span>
                                    </template>
                                    <template v-slot:[`item.departure_time`]="{ item }">
                                        <v-icon class="pulse-icon" color="purple accent-2" v-show="item.actual">mdi-antenna</v-icon>
                                        <span v-if="item.actual" class="font-italic" :class="$vuetify.breakpoint.xs ? 'caption' : ''">
                                            {{ item.departure_text }}
                                        </span>
                                        <span v-else class="font-italic" :class="$vuetify.breakpoint.xs ? 'caption' : ''">
                                            {{ 
                                                relativeDepartureTimeText 
                                                ? `~ ${$moment(item.departure_time * 1000).fromNow()}`
                                                : `${item.departure_text} ${$moment(item.departure_time * 1000).format('A')}`
                                            }}
                                        </span>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-card-text>
                    </v-fade-transition>
                </v-card>
            </v-flex>
            <v-spacer/>
        </v-layout>
    </v-container>

</template>

<script>
    import { RepositoryFactory, FactoryKeys } from '../repositories/RepositoryFactory';

    const RoutesRepository = RepositoryFactory.build(FactoryKeys.ROUTES);
    const DirectionsRepository = RepositoryFactory.build(FactoryKeys.DIRECTIONS);
    const StopsRepository = RepositoryFactory.build(FactoryKeys.STOPS);
    const DeparturesRepository = RepositoryFactory.build(FactoryKeys.DEPARTURES);

    export default {
        name: 'Home',

        components: {
            
        },

        mounted() {
            RoutesRepository.getRoutes()
                .then((response) => {
                    this.routes = response.data;
                })
        },

        methods: {
            updateSelectedRoute(event) {
                console.log(event);
                this.selectedDirection = '';
                this.selectedStop = '';
                this.nexTripResult = {};
                if (event === null) {
                    this.selectedRoute = '';
                } else {
                    this.selectedRoute = event;
                    DirectionsRepository.getDirections(this.selectedRoute.route_id)
                        .then((response) => {
                            this.directions = response.data;
                        })
                }
            },
            updateSelectedDirection(event) {
                console.log(event);
                this.selectedStop = '';
                this.nexTripResult = {};
                if (event === null) {
                    this.selectedDirection = '';
                } else {
                    this.selectedDirection = event;
                    StopsRepository.getStops(this.selectedRoute.route_id, this.selectedDirection.direction_id)
                        .then((response) => {
                            this.stops = response.data;
                        })
                }
            },
            updateSelectedStop(event) {
                this.nexTripResult = {};
                if (event === null) {
                    this.selectedStop = '';
                } else {
                    this.selectedStop = event;
                    DeparturesRepository.getDeparturesByRoute(this.selectedRoute.route_id, this.selectedDirection.direction_id, this.selectedStop.place_code)
                        .then((response) => {
                            this.nexTripResult = response.data;
                        })
                }
            },
            updateSearchForStopNumber(event) {
                this.nexTripResult = {};
                if (event === null) {
                    this.searchForStopNumber = '';
                }
                if (this.searchForStopNumber === null || this.searchForStopNumber === '') {
                    return;
                } else {
                    DeparturesRepository.getDeparturesByStopNumber(this.searchForStopNumber)
                        .then((response) => {
                            this.nexTripResult = response.data;
                        })
                }
            },
        },

        data: () => ({


            routes: [],
            directions: [],
            stops: [],

            selectedRoute: '',
            selectedDirection: '',
            selectedStop: '',
            searchForStopNumber: '',
            findDeparturesByRoute: true,
            relativeDepartureTimeText: false,
            expandedDepartureTable: false,
            nexTripResult: {},
        }),

        computed: {
            selectedStopDescription() {
                if (this.nexTripResult.stops) {
                    if (this.nexTripResult.stops.length > 0) {
                        return this.nexTripResult.stops[0].description;
                    }
                }
                return '\u00a0';
            },
            selectedStopNumber() {
                if (this.nexTripResult.stops) {
                    if (this.nexTripResult.stops.length > 0) {
                        return `Stop #: ${this.nexTripResult.stops[0].stop_id}`;
                    }
                }
                return '\u00a0';
            },
            departureTableHeaders() {
                return [
                    // text: string
                    // value: string
                    // align?: 'start' | 'center' | 'end'
                    // sortable?: boolean
                    // filterable?: boolean
                    // divider?: boolean
                    // class?: string | string[]
                    // width?: string | number
                    // filter?: (value: any, search: string, item: any) => boolean
                    // sort?: (a: any, b: any) => number
                    {
                        text: "ROUTE",
                        value: "route_short_name",
                        align: "left",
                        width: '0',
                        divider: true,
                        class: `
                            font-weight-bold 
                            rounded-tl-xl 
                            purple ${this.$vuetify.theme.dark ? 'darken-2 white--text' : 'accent-1 black--text'}
                            ${this.$vuetify.breakpoint.xs ? 'caption' : 'subtitle-1'}
                        `,
                        sortable: false,
                    },
                    {
                        text: "DESTINATION",
                        value: "description",
                        align: "left",
                        width: '0',
                        class: `
                            font-weight-bold
                            purple ${this.$vuetify.theme.dark ? 'darken-2 white--text' : 'accent-1 black--text'}
                            ${this.$vuetify.breakpoint.xs ? 'caption' : 'subtitle-1'}
                        `,
                        sortable: false,
                    },
                    {
                        text: "DEPARTS",
                        value: "departure_time",
                        align: "left",
                        width: '0',
                        class: `
                            font-weight-bold
                            rounded-tr-xl
                            purple ${this.$vuetify.theme.dark ? 'darken-2 white--text' : 'accent-1 black--text'}
                            ${this.$vuetify.breakpoint.xs ? 'caption' : 'subtitle-1'}
                        `,
                        sortable: false,
                    },
                ]
            }
        }
    }
</script>

<style>
    .departure-table tr:first-child td:first-child{
        border-top-left-radius: 0px !important;
    }
    .departure-table tr:first-child td:last-child{
        border-top-right-radius: 0px !important;
    }
    .departure-table tr:last-child td:first-child{
        border-bottom-left-radius: 24px !important;
    }
    .departure-table tr:last-child td:last-child{
        border-bottom-right-radius: 24px !important;
    }  
    .departure-table tr.v-data-table__mobile-table-row:last-child{
        border-bottom-left-radius: 24px !important;
        border-bottom-right-radius: 24px !important;
    }

    .pulse-icon {
        animation: pulse 3s infinite;
    }

    @keyframes pulse {
        0% {
            opacity: 0.1;
        }
        40% {
            opacity: 1;
        }
        60% {
            opacity: 1;
        }
        100% {
            opacity: 0.1;
        }
    }
</style>
