import BaseRepository from './BaseRepository';

export default {
    getDirections(route_id) {
        return BaseRepository.get(`/nextripv2/directions/${route_id}`, undefined);
    }
}