/**
 * Created by zenghongtu on 13/09/2018.
 * Desc: user
 */

import User from "../models/user";
import bcrypt from "../utils/bcrypt";

class UserControllers {

    async find(ctx) {
        const limit = ctx.query.limit;
        const page = ctx.query.page;
        const field = ctx.query.field;
        ctx.body = await User.fetch(+limit, +page, field);
    }

    async findById(ctx) {
        const id = ctx.params.id;
        try {
            const user = await User.findById(id);
            if (!user) {
                ctx.throw(404);
            }
            ctx.body = user;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    async add(ctx) {
        try {
            ctx.body = await new User(ctx.request.body).save();
        } catch (err) {
            ctx.throw(422);
        }
    }

    async update(ctx) {
        try {
            const _body = ctx.request.body;
            if (!_body) ctx.throw(400);
            let user = null;
            if (_body.password) {
                const _password = await bcrypt(_body.password);
                user = await User.findOneAndUpdate(
                    {name: _body.name},
                    {password: _password}
                );
            } else {
                user = await User.findByIdAndUpdate(
                    ctx.params.id,
                    _body
                );
            }
            if (!user) {
                ctx.throw(404);
            }
            ctx.body = 'update success';
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    async delete(ctx) {
        try {
            const user = await User.findByIdAndRemove(ctx.params.id);
            if (!user) {
                ctx.throw(404);
            }
            ctx.body = user;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }
}

export default new UserControllers();

