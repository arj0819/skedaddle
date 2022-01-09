import BaseRepository from './BaseRepository';

export default {
    getDeparturesByRoute(route_id, direction_id, place_code) {
        return BaseRepository.get(`/nextripv2/${route_id}/${direction_id}/${place_code}`, undefined);
    },
    getDeparturesByStopNumber(stop_id) {
        return BaseRepository.get(`/nextripv2/${stop_id}`, undefined);
    }
}