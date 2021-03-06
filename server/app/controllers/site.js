/**
 * Created by zenghongtu on 15/09/2018
 * Desc: site
 */

import Site from '../models/site';
import User from '../models/user';
import client from "../utils/redis";
import date from '../utils/date'

class SiteControllers {
    async find(ctx) {
        try {
            ctx.body = await Site.fetch()
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    async findById(ctx) {
        try {
            let _id = ctx._id;
            const visits = await client.get(_id);
            const pageViews = await client.get('pageViews');
            const uniqueVisitors = await client.get('uniqueVisitors');
            const site = await Site.findOneAndUpdate(
                {date: date()},
                {pv: pageViews, uv: uniqueVisitors},
                {new: true, upsert: true}
            );
            const visitor = await User.findByIdAndUpdate(
                _id,
                {visits},
                {new: true}
            );
            const start_time = await client.get('start_time');
            ctx.body = {site, visitor, start_time}
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    async add(ctx) {
        try {
            const body = ctx.request.body;
            ctx.body = await new Site(body).save();
        } catch (err) {
            ctx.throw(422);
        }
    }

    async update(ctx) {
        try {
            const site = await Site.findByIdAndUpdate(
                ctx.params.id,
                ctx.request.body
            );
            if (!site) {
                ctx.throw(404);
            }
            ctx.body = site;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }

    async delete(ctx) {
        try {
            const site = await Site.findByIdAndRemove(ctx.params.id);
            if (!site) {
                ctx.throw(404);
            }
            ctx.body = site;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }
}

export default new SiteControllers();
