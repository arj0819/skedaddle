import Vue from 'vue'
import Vuetify from 'vuetify'

import {  shallowMount } from '@vue/test-utils'
import NexTripResult from '@/components/NexTripResult.vue'

const vuetify = new Vuetify();

// give the tests required dependencies
Vue.use(Vuetify);

describe('NexTripResult.vue', () => {
    it('prop nexTripResult is being passed', () => {
        const nexTripResult = {
            departures: [
                {
                    "actual":true,
                    "trip_id":"20247094-DEC21-RAIL-Weekday-01",
                    "stop_id":51437,"departure_text":"5 Min",
                    "departure_time":1641840420,"description":"to Mpls-Target Field",
                    "route_id":"901",
                    "route_short_name":"Blue",
                    "direction_id":0,
                    "direction_text":"NB",
                    "schedule_relationship":"Scheduled"
                }
            ],
            alerts: [
                {
                    "stop_closed":false,
                    "alert_text":"Upper levels of Metro Transit's 28th Ave Station parking ramp are closed until further notice"
                }
            ],
            stops: [
                {
                    "stop_id":51405,
                    "latitude":44.854277,
                    "longitude":-93.238877,
                    "description":"MOA Transit Station"
                }
            ]
        }
        const wrapper = shallowMount(NexTripResult, {
            vuetify,
            propsData: { nexTripResult },
        });
        
        expect(wrapper.props('nexTripResult')).toEqual(nexTripResult);
    });
});