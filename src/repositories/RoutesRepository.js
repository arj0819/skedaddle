import BaseRepository from './BaseRepository';

export default {
    getRoutes() {
        return BaseRepository.get(`/nextripv2/routes`, undefined);
    }
}