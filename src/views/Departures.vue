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
                        <v-btn-toggle data-test-id="findByDepartureToggle"
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
                                    return-object clearable 
                                    @input="updateSelectedStop"
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
                                    <v-text-field color="purple accent-2" type="number"
                                        v-model="searchForStopNumber" outlined
                                        :dense="$vuetify.breakpoint.xs" 
                                        label="Enter Stop #" clearable min="0"
                                        hide-details class="rounded-xl mb-5"
                                        @keypress.enter="[updateSearchForStopNumber(searchForStopNumber), updateDeparturesByStopNumber()]"
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex shrink>
                                    <v-btn
                                        icon fab text
                                        :small="$vuetify.breakpoint.xs" 
                                        color="purple accent-2"
                                        @click="[updateSearchForStopNumber(searchForStopNumber), updateDeparturesByStopNumber()]"
                                    >
                                        <v-icon :large="!$vuetify.breakpoint.xs">mdi-magnify</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-fade-transition>
                </v-card>
                <v-fade-transition>
                    <router-view @clear-result="clearResult" />
                </v-fade-transition>
            </v-flex>
            <v-spacer/>
            <v-snackbar
                v-model="showError" app
                rounded="pill" top timeout="1500"
                text color="red"
            >
                <v-icon color="red">mdi-alert-circle</v-icon>
                <span class="ml-3 subtitle-1 font-weight-bold">
                    {{ errorMessage }}
                </span>
            </v-snackbar>
        </v-layout>
    </v-container>

</template>

<script>
    import { RepositoryFactory, FactoryKeys } from '../repositories/RepositoryFactory';

    const RoutesRepository = RepositoryFactory.build(FactoryKeys.ROUTES);
    const DirectionsRepository = RepositoryFactory.build(FactoryKeys.DIRECTIONS);
    const StopsRepository = RepositoryFactory.build(FactoryKeys.STOPS);

    export default {
        name: 'Home',

        created() {
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'SET_DEPARTURE_PARAMS') {
                    if (state.departureParams.stopId) {
                        this.findDeparturesByRoute = false;
                        this.updateSearchForStopNumber(
                            state.departureParams.stopId,
                        )
                    } else {
                        this.findDeparturesByRoute = true;
                        this.updateDeparturesByRoute(
                            state.departureParams.routeId,
                            parseInt(state.departureParams.directionId),
                            state.departureParams.placeCode
                        )
                    }
                }
            })
        },

        mounted() {
            RoutesRepository.getRoutes()
                .then((response) => {
                    this.routes = response.data;

                    let stopId = this.$route.params['stop_id'] || null;
                    let routeId = this.$route.params['route_id'] || null;
                    let directionId = this.$route.params['direction_id'] || null;
                    let placeCode = this.$route.params['place_code'] || null;
                    
                    if (stopId !== null) {
                        this.findDeparturesByRoute = false;
                        this.updateSearchForStopNumber(parseInt(stopId));
                    } else if (routeId !== null && directionId !== null && placeCode !== null) {
                        this.updateDeparturesByRoute(routeId, parseInt(directionId), placeCode);
                    } else {
                        //
                    }
                })
                .catch(() => {
                    this.errorMessage = 'Could not get routes. Please try again'
                    this.showError = true;
                })
        },

        methods: {
            /**
             * Clears dependenant local state values, then
             * Updates local selectedRoute and triggers API
             * call to get the associated directions if necessary.
             * @param event The value to update selectedRoute to
             */
            updateSelectedRoute(event) {
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
                        .catch(() => {
                            this.errorMessage = 'Could not get directions. Please try again'
                            this.showError = true;
                        })
                }
            },
            /**
             * Clears dependenant local state values, then
             * Updates local selectedDirection and triggers API
             * call to get the associated stops if necessary.
             * @param event The value to update selectedDirection to
             */
            updateSelectedDirection(event) {
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
                        .catch(() => {
                            this.errorMessage = 'Could not get stops. Please try again'
                            this.showError = true;
                        })
                }
            },
            /**
             * Clears dependenant local state values, then
             * Updates local selectedStop and triggers a route
             * navigation to display resulting departures by route.
             * @param event The value to update selectedStop to
             */
            updateSelectedStop(event) {
                this.nexTripResult = {};
                if (event === null) {
                    this.selectedStop = '';
                } else {
                    this.selectedStop = event;
                    this.navigateToDeparturesByRoute(
                        this.selectedRoute.route_id, 
                        this.selectedDirection.direction_id, 
                        this.selectedStop.place_code
                    );
                }
            },
            /**
             * Clears dependenant local state values, then
             * Updates local searchForStopNumber.
             * @param stopNumber The value to update searchForStopNumber to, defaults to null
             */
            updateSearchForStopNumber(stopNumber = null) {
                this.nexTripResult = {};
                this.searchForStopNumber = stopNumber;

                if (this.searchForStopNumber === null) {
                    return;
                } else {
                    //
                }
            },
            /**
             * If local state searchForStopNumber is valid, 
             * triggers a route navigation to display 
             * resulting departures by stop number.
             */
            updateDeparturesByStopNumber() {
                if (this.searchForStopNumber === null || this.searchForStopNumber === '') {
                    return;
                }
                this.navigateToDeparturesByStopNumber(this.searchForStopNumber);
            },
            /**
             * Updates all local state to fill in dropdowns
             * provided by route parameters, making
             * necessary API calls along the way.
             * @param routeId
             * @param directionId
             * @param placeCode
             */
            updateDeparturesByRoute(routeId, directionId, placeCode) {
                this.nexTripResult = {};
                this.selectedRoute = this.routes.filter((route) => {
                    return route.route_id === routeId
                })[0];

                DirectionsRepository.getDirections(routeId)
                    .then((response) => {
                        this.directions = response.data;
                        this.selectedDirection = this.directions.filter((direction) => {
                            return direction.direction_id === directionId
                        })[0];
                    })
                    .then(() => {
                        return StopsRepository.getStops(routeId, directionId)
                            .then((response) => {
                                this.stops = response.data;
                                this.selectedStop = this.stops.filter((stop) => {
                                    return stop.place_code === placeCode
                                })[0];
                            })
                            .catch(() => {
                                this.errorMessage = 'Could not get place code. Please try again'
                                this.showError = true;
                            })
                    })      
                    .catch(() => {
                        this.errorMessage = 'Could not get direction. Please try again'
                        this.showError = true;
                    })      
            },
            /**
             * Pushes a route navigation to the departures
             * by route, defined by the parameters.
             * @param routeId
             * @param directionId
             * @param placeCode
             */
            navigateToDeparturesByRoute(routeId, directionId, placeCode) {
                if (`/departures/${routeId}/${directionId}/${placeCode}` !== this.$route.path) {
                    this.$router.push({
                        path: `/departures/${routeId}/${directionId}/${placeCode}`,
                        params: {
                            route_id: routeId,
                            direction_id: directionId,
                            place_code: placeCode
                        }
                    })
                }
            },
            /**
             * Pushes a route navigation to the departures
             * by stopNumber
             * @param stopNumber
             */
            navigateToDeparturesByStopNumber(stopNumber) {
                if (`/departures/${stopNumber}` !== this.$route.path) {
                    this.$router.push({
                        path: `/departures/${stopNumber}`,
                        params: {
                            stop_id: stopNumber,
                        }
                    })
                }
            },
            clearResult() {
                this.selectedStop = '';
                this.searchForStopNumber = '';
            }
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
            errorMessage: '',
            showError: false,
            
            nexTripResult: {},
        }),
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
</style>
