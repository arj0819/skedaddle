import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        departureParams: {
            stopId: '',
            routeId: '',
            directionId: '',
            placeCode: '',
        },
    },
    mutations: {
        SET_DEPARTURE_PARAMS(state, departureParams) {
            state.departureParams = departureParams;
        },
    },
    actions: {
        setDepartureParams(context, departureParams) {
            context.commit('SET_DEPARTURE_PARAMS', departureParams);
        },
    },
    getters: {
        getDepartureParams(state) {
            return state.departureParams;
        },
    },
    modules: {}
})
