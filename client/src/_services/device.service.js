import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper } from '@/_helpers';

const deviceSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/devices`;

export const deviceService = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
    delete: _delete,
    device: deviceSubject.asObservable(),
    get deviceValue() { return deviceSubject.value }
};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getByUserId(id) {
    return fetchWrapper.get(`${baseUrl}/userId/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(device => {
            device = { ...deviceSubject.value, ...device };
            deviceSubject.next(device);
            return device;
        });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
}


