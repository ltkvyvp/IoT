const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const AccountSchema = new Schema({
    email: { 
        type: String, 
        required: true 
    },
    passwordHash: { 
        type: String, 
        required: true
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String,
        required: true 
    },
    birthday: { 
        type: Date, 
        required: true 
    },
    acceptTerms: { 
        type: Boolean 
    },
    role: { 
        type: String, 
        required: true 
    },
    verificationToken: { 
        type: String 
    },
    verified: { 
        type: Date 
    },
    resetToken: { 
        type: String 
    },
    resetTokenExpires: { 
        type: Date 
    },
    passwordReset: {
        type: Date 
    },
    isBanned: { 
        type: Boolean, 
        required: true,
        default: false 
    },
    devices: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Device',
        }
    ]
}, {
    timestamps: true, //ngày tạo và ngày sửa gần nhất
    toJSON: { virtuals: true }
});

AccountSchema.virtual('isVerified').get(function() {
    return !!(this.verified || this.passwordReset);
});

AccountSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Account)
        return db.model('Account', AccountSchema);
    return db.models.Account;
}