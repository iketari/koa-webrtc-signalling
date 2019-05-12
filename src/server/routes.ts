
import * as Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx) => {
    await ctx.render('index.pug', {
        user: 'John'
    });
});

router.get('/test', async (ctx) => {
    ctx.status = 201;
    ctx.body = 'test';
});

export const routes = router.routes();
