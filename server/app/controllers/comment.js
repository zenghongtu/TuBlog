/**
 * Created by zenghongtu on 13/09/2018
 * Desc: comment
 */

import Comment from '../models/comment';
import User from "../models/user";

class CommentControllers {

    async find(ctx) {
        const field = ctx.query.field || '';
        ctx.body = await Comment.fetch(field);
    }

    async findById(ctx) {
        const id = ctx.params.id;
        try {
            const comment = await Comment.findById(id);
            if (!comment) {
                ctx.throw(404);
            }
            ctx.body = comment;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    /**
     * 新增评论
     * @param ctx
     * @returns {Promise<void>}
     */
    async add(ctx) {
        try {
            let _id = ctx.request.header._id;
            const _comment = ctx.request.body;
            const comment = await new Comment(_comment).save();
            if (_id || _comment.from) {
                await User.findByIdAndUpdate(_id, {$addToSet: {'comments': comment._id}}, {upsert: true})
            }
            ctx.body = comment;
        } catch (err) {
            ctx.throw(422);
        }
    }

    /**
     * 回复评论
     * @param ctx
     * @returns {Promise<void>}
     */
    async update(ctx) {
        try {
            const comment = await Comment.findById(ctx.params.id);
            if (!comment) {
                ctx.throw(404);
            }
            const _comment = ctx.request.body;

            const reply = {
                from: _comment.from,  // 回复人 ID
                to: _comment.to,  // 被回复人 ID
                content: _comment.content
            };
            comment.reply.push(reply);
            await User.findByIdAndUpdate(_comment.from, {$addToSet: {'comments': comment._id}}, {upsert: true});
            ctx.body = await comment.save();
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    async delete(ctx) {
        try {
            const comment = await Comment.findByIdAndUpdate(ctx.params.id, {
                content: '该条评论已被删除'
            });
            if (!comment) {
                ctx.throw(404);
            }
            ctx.body = comment;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }
}

export default new CommentControllers();
