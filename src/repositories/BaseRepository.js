import axios from 'axios';

const API_BASE_URL = 'https://svc.metrotransit.org';

let httpClient = axios.create({
    baseURL: API_BASE_URL
});

function get(requestURL, config = {}) {
    console.log(`GET: url -> ${API_BASE_URL + requestURL}`);
    return httpClient.get(requestURL, config);
}

function post(requestURL, data, config = {}) {
    console.log(`POST: url -> ${API_BASE_URL + requestURL}`);
    console.log(`      data -> ${JSON.stringify(data)}`);
    return httpClient.post(requestURL, data, config);
}

export default {
    get,
    post
};