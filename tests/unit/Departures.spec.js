import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

import { shallowMount } from '@vue/test-utils'
import Departures from '@/views/Departures.vue'

// give the tests required dependencies
Vue.use(Vuetify);
Vue.use(Vuex);
Vue.use(VueRouter);

const vuetify = new Vuetify();
const store = new Vuex.Store();

describe('Departures.vue', () => {
    it('local state findDeparturesByRoute is true on byRoute button click', () => {
        const wrapper = shallowMount(Departures, {
            vuetify,
            store
        });
        wrapper.setData({
            findDeparturesByRoute: false
        })
        wrapper.find('[data-test-id="findByDepartureToggle"]').vm.$emit('change', true);
        
        expect(wrapper.vm.findDeparturesByRoute).toBe(true);
    });
});
describe('Departures.vue', () => {
    it('local state findDeparturesByRoute is false on byStopNumber button click', () => {
        const wrapper = shallowMount(Departures, {
            vuetify,
            store
        });
        wrapper.setData({
            findDeparturesByRoute: true
        })
        wrapper.find('[data-test-id="findByDepartureToggle"]').vm.$emit('change', false);

        expect(wrapper.vm.findDeparturesByRoute).toBe(false);
    });
});