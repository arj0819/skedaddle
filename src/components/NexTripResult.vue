<template>
    <v-card class="rounded-xl" flat color="transparent">
        <v-card-title class="mt-1">
            <v-layout wrap justify-space-between align-center>
                <v-flex shrink v-show="selectedStopDescription !== ''">
                    <span class="text-h5 font-weight-bold">{{ selectedStopDescription }}</span>
                </v-flex>
                <v-spacer />
                <v-flex shrink v-show="selectedStopNumber !== ''">
                    <span class="subtitle-2">Stop # {{ selectedStopNumber }}</span>
                    <v-btn
                        @click="copyStopNumberToClipboard(selectedStopNumber)"
                        text rounded icon color="purple accent-2" class="ml-1"
                    >
                        <v-icon small>mdi-file-multiple-outline</v-icon>
                    </v-btn>
                    <v-snackbar
                        v-model="showCopied" app
                        rounded="pill" top timeout="1500"
                        text color="green"                        
                    >
                        <v-icon color="green">mdi-check-circle</v-icon>
                        <span class="ml-3 subtitle-2 font-weight-bold">
                            Copied!
                        </span>
                    </v-snackbar>
                    <v-snackbar
                        v-model="showNotCopied" app
                        rounded="pill" top timeout="1500"
                        text color="red"
                    >
                        <v-icon color="red">mdi-alert-circle</v-icon>
                        <span class="ml-3 subtitle-1 font-weight-bold">
                            Could not copy
                        </span>
                    </v-snackbar>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-fade-transition>
            <v-card-text>
                <v-layout v-show="nexTripResult.alerts.length > 0" wrap justify-center>
                    <v-flex shrink v-for="(alert, index) in nexTripResult.alerts" :key="index">
                        <v-alert
                            dense text class="rounded-xl mb-2"
                            :type="alert.stop_closed ? 'error' : 'info'"
                            :icon="alert.stop_closed ? 'mdi-alert-octagon' : 'mdi-alert-circle'"
                        >
                            <span :class="$vuetify.breakpoint.xs ? 'caption' : ''">{{ alert.alert_text }}</span>
                            <span 
                                v-show="alert.stop_closed"
                                class="font-weight-bold" 
                                :class="$vuetify.breakpoint.xs ? 'caption' : ''"
                            >
                                <br><br>
                                This alert indicates that this stop is currently closed.
                            </span>
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
</template>

<script>
    export default {
        name: 'NexTripResult',

        props: {
            nexTripResult: {
                type: Object,
                required: true,
            }
        },

        data: () => ({
            relativeDepartureTimeText: false,
            expandedDepartureTable: false,
            showCopied: false,
            showNotCopied: false,
        }),

        methods: {
            async copyStopNumberToClipboard(stopNumberText) {
                try {
                    await navigator.clipboard.writeText(stopNumberText);
                    this.showCopied = true;
                } catch {
                    this.showNotCopied = true;
                }
            }
        },

        computed: {
            selectedStopDescription() {
                if (this.nexTripResult.stops) {
                    if (this.nexTripResult.stops.length > 0) {
                        return this.nexTripResult.stops[0].description;
                    }
                }
                return '';
            },
            selectedStopNumber() {
                if (this.nexTripResult.stops) {
                    if (this.nexTripResult.stops.length > 0) {
                        return this.nexTripResult.stops[0].stop_id;
                    }
                }
                return '';
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