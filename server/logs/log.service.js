const db = require('_helpers/db');
const Log = db.Log;
const Device = db.Device;
const Account = db.Account;

module.exports = {
    getAll,
    getById,
    getByDeviceId,
    getByUserId,
    delete: _delete
};

async function getAll() {
    const logs = await Log.find();
    return logs.map(x => basicDetails(x));
}

async function getById(id) {
    const log = await getLog(id);
    return basicDetails(log);
}

async function getByDeviceId(id) {
    const device = await Device.findById(id);
    const logs = await Log.find({ device: device._id });
    return logs.map(x => basicDetails(x))
}

async function getByUserId(id) {
    const user = await Account.findById(id);
    const logs = await Log.find({ device: { $in: user.devices } });
    return logs.map(x => basicDetails(x))
}

async function _delete(id) {
    await Log.findByIdAndRemove(id);
}

// helper functions

async function getLog(id) {
    const log = await Log.findById(id);
    if (!log) throw 'Không tồn tại thiết bị';
    return log;
}


function basicDetails(log) {
    const { _id, device, data, createdAt, updatedAt } = log;
    let id = _id
    return { id, device, data, createdAt, updatedAt };
}