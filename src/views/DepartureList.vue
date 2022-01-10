<template>
    <v-fade-transition group>
        <nex-trip-result :key="1"
            v-if="Object.keys(nexTripResult).length > 0"
            :nexTripResult="nexTripResult"
        >
        </nex-trip-result>
        <v-layout justify-center wrap :key="2" v-if="Object.keys(nexTripResult).length > 0" class="ml-1 mr-1">
            <v-btn text outlined rounded :small="$vuetify.breakpoint.xs" color="red" @click="clearResult">
                <v-icon>mdi-close</v-icon>
                Clear this result
            </v-btn>
        </v-layout>
        <v-snackbar :key="3"
            v-model="showError" app
            rounded="pill" top timeout="1500"
            text color="red"
        >
            <v-icon color="red">mdi-alert-circle</v-icon>
            <span class="ml-3 subtitle-1 font-weight-bold">
                Could not locate departures. Please try again.
            </span>
        </v-snackbar>
    </v-fade-transition>
</template>

<script>
import NexTripResult from '../components/NexTripResult.vue'
import { FactoryKeys, RepositoryFactory } from '../repositories/RepositoryFactory'

const DeparturesRepository = RepositoryFactory.build(FactoryKeys.DEPARTURES);

    export default {
        name: 'Departures',

        components: {
            NexTripResult
        },

        props: {
            stopId: {
                type: Number,
                required: false
            },
            routeId: {
                type: String,
                required: false
            },
            directionId: {
                type: Number,
                required: false
            },
            placeCode: {
                type: String,
                required: false
            },
        },

        created() {
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'SET_DEPARTURE_PARAMS') {
                    if (state.departureParams.stopId) {
                        this.updateDeparturesByStopNumber(
                            state.departureParams.stopId,
                        )
                    } else {
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
            if (this.stopId !== undefined) {
                this.updateDeparturesByStopNumber(this.stopId);
            } else if (this.routeId !== undefined && this.directionId !== undefined && this.placeCode !== undefined) {
                this.updateDeparturesByRoute(this.routeId, this.directionId, this.placeCode);
            } else {
                //
            }
        },
        methods: {
            updateDeparturesByRoute(routeId, directionId, placeCode) {
                DeparturesRepository.getDeparturesByRoute(routeId, directionId, placeCode)
                .then((response) => {
                    this.nexTripResult = response.data
                })
                .catch(() => {
                    this.showError = true;
                })
            },
            updateDeparturesByStopNumber(stopNumber) {
                DeparturesRepository.getDeparturesByStopNumber(stopNumber)
                .then((response) => {
                    this.nexTripResult = response.data
                })
                .catch(() => {
                    this.showError = true;
                })
            },
            clearResult() {
                this.nexTripResult = {};
                this.$emit('clear-result');
            }
        },
        data: () => ({
            nexTripResult: {},
            showError: false
        }),

    }
</script>