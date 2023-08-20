const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserMenuRatingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    menu: {
        type: Schema.Types.ObjectId,
        ref: 'menus'
    },
    rating: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('usermenuratings', UserMenuRatingSchema)