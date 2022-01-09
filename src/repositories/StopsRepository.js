import BaseRepository from './BaseRepository';

export default {
    getStops(route_id, direction_id) {
        return BaseRepository.get(`/nextripv2/stops/${route_id}/${direction_id}`, undefined);
    }
}