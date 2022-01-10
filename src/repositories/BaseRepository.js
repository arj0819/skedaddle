import axios from 'axios';

const API_BASE_URL = 'https://svc.metrotransit.org';

let httpClient = axios.create({
    baseURL: API_BASE_URL
});

function get(requestURL, config = {}) {
    return httpClient.get(requestURL, config);
}

function post(requestURL, data, config = {}) {
    return httpClient.post(requestURL, data, config);
}

export default {
    get,
    post
};