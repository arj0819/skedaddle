<template>
    <v-container grid-list-lg>
        <v-layout wrap>
            <v-spacer/>
            <v-flex xs12 sm10 md8 lg8 xl6>
                <v-card flat color="transparent">
                    <v-card-title>
                        <span class="text-h5 font-weight-bold">What is Skedaddle?</span>
                    </v-card-title>
                    <v-card-text>
                        Skedaddle is a real-time and scheduled departure finder for the MetroTransit system in the Minneapolis/St. Paul area.
                        It was designed to help eliminate uncertainty when travelling via the MetroTransit transportation system.
                    </v-card-text>
                    <v-card-title>
                        <span class="text-h5 font-weight-bold">What can Skedaddle do?</span>
                    </v-card-title>
                    <v-card-text class="pb-0">
                        With Skedaddle, you can choose a route, direction and location to get a list of upcomming real-time and scheduled departure times.
                        Real-time departure times are only given within a 20 minute window, and they are prefixed with the 
                        <v-icon color="purple accent-2" class="pulse-icon">mdi-antenna</v-icon> icon. Scheduled departure times are not real-time.
                    </v-card-text>
                    <v-card-text class="pb-0">
                        As recommended by NexTrip, please arrive at the stop at least 5 minutes prior to any real-time or scheduled departure time.
                    </v-card-text>
                    <v-card-text class="font-weight-bold subtitle-1">
                        <v-alert
                            type="warning" class="rounded-xl" 
                            dense text icon="mdi-alert"
                        >
                            Departure times are always subject to change, even real-time departure times. Please ensure arrival at the stop at least 5 minutes in advance. 
                            Please visit <a href="https://www.metrotransit.org/about-nextrip">About NexTrip</a> for more information.
                        </v-alert>
                    </v-card-text>
                    <v-card-title class="justify-center">
                        <span class="text-h5 font-weight-bold">Thanks for using Skedaddle!</span>
                    </v-card-title>
                    <logo-button/>
                </v-card>
            </v-flex>
            <v-spacer/>
        </v-layout>
    </v-container>
</template>

<script>
    import LogoButton from '../components/LogoButton'

    export default {
        name: 'Home',

        components: {
            LogoButton
        },
    }
</script>
