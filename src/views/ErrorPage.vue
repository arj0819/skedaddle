<template>
    <v-container grid-list-lg>
        <v-layout wrap>
            <v-spacer/>
            <v-flex xs12 sm10 md8 lg8 xl6>
                <v-card flat color="transparent">
                    <v-card-title class="text-h5 font-weight-bold">
                        Whoops!
                    </v-card-title>
                    <v-card-text class="pb-0 text-center">
                        The resource at <span class="font-weight-bold">{{ $route.fullPath }}</span> could not be found. Please check the URL.
                    </v-card-text>
                    <v-card-text class="text-center">
                        Click the logo to visit the departures page, or use the left navigation panel.
                    </v-card-text>
                    <logo-button/>
                </v-card>
            </v-flex>
            <v-spacer/>
        </v-layout>
    </v-container>
</template>

<script>
    import LogoButton from '../components/LogoButton.vue'

    export default {
        name: 'Home',

        components: {
            LogoButton
        },
    }
</script>