const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const RefreshTokenSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true 
    },
    token: { 
        type: String, 
    },
    expires: { 
        type: Date, 
    },
    createdByIp: { 
        type: String, 
    },
    revoked: { 
        type: Date, 
    },
    revokedByIp: { 
        type: String, 
    },
    replacedByToken: { 
        type: String,
    },
}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
})

RefreshTokenSchema.virtual('isExpired').get(function() {
    return Date.now() >= this.expires;
});

RefreshTokenSchema.virtual('isActive').get(function() {
    return !this.revoked && !this.isExpired;
});

RefreshTokenSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.RefreshToken)
        return db.model('RefreshToken', RefreshTokenSchema);
    return db.models.RefreshToken;
}