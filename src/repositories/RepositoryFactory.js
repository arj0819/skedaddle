import RoutesRepository from "./RoutesRepository";
import DirectionsRepository from "./DirectionsRepository";
import StopsRepository from "./StopsRepository";
import DeparturesRepository from "./DeparturesRepository";

// Reporitory Factory Keys to use throughout the app to help remove ambiguity.
// Make sure to import FactoryKeys when using the RepositoryFactory.
export const FactoryKeys = {
    AGENCIES: 'agencies',
    ROUTES: 'routes',
    DIRECTIONS: 'directions',
    STOPS: 'stops',
    DEPARTURES: 'departures',
    VEHICLES: 'vehicles'
}

const repositories = {
    [FactoryKeys.ROUTES]: RoutesRepository,
    [FactoryKeys.DIRECTIONS] : DirectionsRepository,
    [FactoryKeys.STOPS] : StopsRepository,
    [FactoryKeys.DEPARTURES] : DeparturesRepository,
};

export const RepositoryFactory = {
    build: (key) => repositories[key]
}