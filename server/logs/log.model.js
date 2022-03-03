const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LogSchema = new Schema({
    device: {
        type: Schema.Types.ObjectId,
        ref: 'Device',
    },
    data: [
        {
            attributeName: {
                type: String,
                require: true
            },
            value: {
                type: String,
                require: true
            }
        }
    ]
}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});


LogSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Log)
        return db.model('Log', LogSchema);
    return db.models.Log;
}