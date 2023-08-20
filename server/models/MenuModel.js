const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    items: [
        {
            type: String,
            required: true
        }
    ],
    tags: [
        {
            type: String,
            required: true
        }
    ],
    isPublic: {
        type: Boolean,
    },
    rating: {
        type: String,
        default: '0'
    },
    ratedCount: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true })

module.exports = mongoose.model('menus', MenuSchema);