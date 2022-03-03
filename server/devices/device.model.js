const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DeviceSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: true
    },
    topic: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});


DeviceSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Device)
        return db.model('Device', DeviceSchema);
    return db.models.Device;
}