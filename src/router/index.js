import Vue from 'vue'
import VueRouter from 'vue-router'
import Departures from '../views/Departures.vue'
import About from '../views/About.vue'
import ErrorPage from '../views/ErrorPage.vue'
import DepartureList from '../views/DepartureList.vue'
import store from '../store';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: {
            name: 'Departures'
        }
    },
    {
        path: '/departures',
        name: 'Departures',
        component: Departures,
        children: [
            {
                path: ':stop_id',
                name: 'Departures by Stop Number',
                component: DepartureList,
                props: route => ({
                    stopId: parseInt(route.params.stop_id) || null
                })
            },
            {
                path: ':route_id/:direction_id/:place_code',
                name: 'Departures by Route',
                component: DepartureList,
                props: route => ({
                    routeId: route.params.route_id,
                    directionId: parseInt(route.params.direction_id),
                    placeCode: route.params.place_code,
                })
            },
        ],
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '*',
        component: ErrorPage
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (to.path === from.path) {
        return;
    } else {
        if (to.name === 'Departures by Stop Number' || to.name === 'Departures by Route') {
            store.dispatch('setDepartureParams', {
                stopId: to.params.stop_id || null,
                routeId: to.params.route_id || null,
                directionId: to.params.direction_id || null,
                placeCode: to.params.place_code || null
            });
        }
        next();
    }
});

export default router
