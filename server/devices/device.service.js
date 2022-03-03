const db = require('_helpers/db');
const Device = db.Device
const Account = db.Account

module.exports = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const devices = await Device.find();
    return devices.map(x => basicDetails(x));
}

async function getById(id) {
    const device = await getDevice(id);
    return basicDetails(device);
}

async function getByUserId(id) {
    const user = await Account.findById(id);
    const devices = await Device.find( { _id: { $in: user.devices } });
    return devices.map(x => basicDetails(x))
}

async function create(params) {
    // validate
    if (await Device.findOne( { name: params.name } )) {
        throw 'Tên "' + params.name + '" đã được sử dụng';
    }
    const device = new Device(params);

    // save device
    await device.save();

    return basicDetails(device);
}

async function update(id, params) {
    const device = await getDevice(id);

    // validate (if name was changed)
    if (params.name && device.name !== params.name && await Device.findOne({ name: params.name } )) {
        throw 'Name "' + params.name + '" đã được sử dụng';
    }

    // copy params to device and save
    Object.assign(device, params);
    await device.save();

    return basicDetails(device);
}

async function _delete(id) {
    await Device.findByIdAndRemove(id);
}

// helper functions

async function getDevice(id) {
    const device = await Device.findById(id);
    if (!device) throw 'Không tồn tại thiết bị';
    return device;
}


function basicDetails(device) {
    const { _id, name, code, topic, type } = device;
    let id = _id
    return { id, name, code, topic, type };
}

