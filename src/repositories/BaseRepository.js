import axios from 'axios';

// The Base URL for provided API
const API_BASE_URL = 'https://svc.metrotransit.org';

let httpClient = axios.create({
    baseURL: API_BASE_URL
});

// Wrap http client get function here
function get(requestURL, config = {}) {
    return httpClient.get(requestURL, config);
}

// Wrap http client post function here
function post(requestURL, data, config = {}) {
    return httpClient.post(requestURL, data, config);
}

export default {
    get,
    post
};