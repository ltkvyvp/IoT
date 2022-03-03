import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper } from '@/_helpers';

const logSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/logs`;

export const logService = {
    getAll,
    getById,
    getByDeviceId,
    getByUserId,
    delete: _delete,
    log: logSubject.asObservable(),
    get logValue() { return logSubject.value }
};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getByDeviceId(id) {
    return fetchWrapper.get(`${baseUrl}/deviceId/${id}`);
}

function getByUserId(id) {
    return fetchWrapper.get(`${baseUrl}/userId/${id}`);
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
}