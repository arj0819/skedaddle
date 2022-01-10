<template>
    <v-app :dark="$vuetify.theme.dark">
        <v-navigation-drawer
            v-model="leftNavOpen"
            app 
            clipped
        >
            <v-list nav rounded>
                <v-list-item :to="{path: '/about'}">
                    <v-list-item-icon>
                        <v-icon class="ml-2">mdi-help-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                        About
                    </v-list-item-title>
                </v-list-item>
                <v-list-item :to="{path: '/departures'}">
                    <v-list-item-icon>
                        <v-icon class="ml-2">mdi-bus-clock</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                        Departures
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar 
            app 
            clipped-left
            src="./assets/background.jpg"
        >
            <template v-slot:img="{ props }">
                <v-img 
                    v-bind="props"
                    position="26% 43.5%"
                    class="app-bar-background"
                >
                    <v-overlay :color="$vuetify.theme.dark ? '#000' : '#FFF'" :value="true" opacity="0.75">
                    </v-overlay>
                </v-img>
            </template>
            <v-btn @click.stop="leftNavOpen = !leftNavOpen" icon class="ml-1">
                <v-icon>{{leftNavOpen ? 'mdi-backburger' : 'mdi-menu'}}</v-icon>
            </v-btn>

            <v-btn text color="purple accent-2" x-large :to="{path: '/'}" :class="`ml-2 mr-2 pl-2 pr-3`" rounded active-class="no-active">
                <v-img src="./assets/skedaddle_logo.png" height="40" width="40"></v-img>
                <span :class="`text-h5 ml-2 text-capitalize font-weight-bold ${$vuetify.theme.dark ? 'white--text' : 'black--text'}`">Skedaddle</span>
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark" class="mr-1">
                <v-icon large v-if="$vuetify.theme.dark" color="amber lighten-2">
                    mdi-weather-sunny
                </v-icon>
                <v-icon large v-else color="indigo darken-2">
                    mdi-weather-night
                </v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-fade-transition leave-absolute>
                <router-view/>
            </v-fade-transition>
        </v-main>

        <v-footer app padless>
            <v-container class="pb-1 pt-1">
                <v-layout class="text-center" align-content-center>
                    <v-flex xs12>
                        <span class="caption font-weight-bold">
                            &copy;{{ $moment().format('YYYY') }} Skedaddle - Powered By 
                            <a href="https://www.metrotransit.org/nextrip">NexTrip</a>, a 
                            <a href="https://www.metrotransit.org/">MetroTransit</a> Service
                        </span>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-footer>

    </v-app>
</template>

<style>
    .v-btn--active.no-active:not(:focus):not(:hover)::before
    {
        opacity: 0 !important;
    }
    .app-bar-background .v-image__image {
        filter: blur(1px);
        transform: scale(1.03);
    }
    .v-card__text, .v-card__title {
        word-break: normal !important;
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

<script>
    export default {
        name: 'App',

        data: () => ({
            leftNavOpen: true,
        }),
    };
</script>
