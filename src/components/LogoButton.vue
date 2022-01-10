<template>
    <v-card-title class="justify-center mb-3">
        <v-img
            aspect-ratio="1"
            src="../assets/skedaddle_logo.png"
            max-height="150"
            max-width="150"
        >
            <v-btn 
                fab 
                max-height="150" 
                max-width="150" 
                width="150" 
                height="150" 
                text 
                color="purple accent-2" 
                :to="{path: '/'}"
            >
            </v-btn>
        </v-img>
    </v-card-title>
</template>

<script>
    export default {
        name: 'LogoButton',
    }
</script>