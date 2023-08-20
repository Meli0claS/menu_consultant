const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserMenuSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    menus: [
        {
            type: Schema.Types.ObjectId,
            ref: 'menus'
        }
    ],
    inUse: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('usermenus', UserMenuSchema)