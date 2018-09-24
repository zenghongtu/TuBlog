/**
 * Created by zenghongtu on 12/09/2018.
 * Desc: user
 */
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'
import bcrypt from '../utils/bcrypt'
import {admin} from "../config";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        default: () => (
            '' + Date.now()
        )
    },
    ip: String,
    email: {
        type: String,
        default: ''
    },
    password: String,
    visits: {
        type: Number,
        default: 1,
    },
    role: {
        type: Number,
        default: 0,
    },
    agent: {
        browser: String,
        version: String,
        platform: String,
        os: String,
    },
    comments: [{
        type: ObjectId,
        ref: 'Comment',
    }]
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.name && user.name === admin) {
        bcrypt(user.password).then(password => {
            user.password = password;
            next()
        }).catch(err => {
            next(err);
        });
    } else {
        next()
    }

});

UserSchema.methods = {
    comparePassword: async function (password) {
        try {
            return await bcryptjs.compare(password, this.password)
        } catch (e) {
            console.log(e)
        }
    }
};

UserSchema.statics = {
    fetch: function (limit, page, field = '') {
        return this
            .find({})
            .skip(page * limit)
            .limit(limit)
            .sort('-created')
            .select(field)
            .sort('-created')
            .populate('comments', 'content')
            .exec()
    },
    findById: function (id) {
        return this
            .findOne({_id: id})
            .populate('comments', 'content')
            .exec()
    }
};

export default UserSchema
