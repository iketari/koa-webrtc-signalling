
import * as Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx) => {
    await ctx.render('index.pug', {
        user: 'John'
    });
});

router.get('/login', async (ctx) => {
    const {username} = ctx.session;
    if (username) {
        ctx.body = {
            username
        };
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
});

router.post('/login', async (ctx) => {
    const {username} = ctx.request.body;
    if (username) {
        ctx.session.username = username;
        ctx.session.save();
        ctx.status = 201;
    } else {
        ctx.status = 401;
    }
});

export const routes = router.routes();
