import test from 'ava';
import dedent from 'dedent';
import express from 'express';
import expressListRoutes from '..';

const app = express();
const router = new express.Router();
const fn = res => {
    res.send({
        ok: 'ok'
    });
};

router.route('/user').post(fn).get(fn).put(fn);

app.use('/api/v1', router);

test.cb('should return callback function', t => {
    expressListRoutes({
        title: 'API:',
        prefix: '/api/v1',
        router
    }, routesList => {
        t.snapshot(routesList, dedent`
            API:
            POST  /api/v1/user
            GET   /api/v1/user
            PUT   /api/v1/user
        `);
        t.end();
    });
});

test('should return a promise [string]', async t => {
    const routesList = await expressListRoutes({
        title: 'API:',
        prefix: '/api/v1',
        router
    });

    t.snapshot(routesList, dedent`
        API:
        POST  /api/v1/user
        GET   /api/v1/user
        PUT   /api/v1/user
    `);
});

test('should return a promise [array]', async t => {
    const routesList = await expressListRoutes({
        prefix: '/api/v1',
        router,
        return: 'array'
    });

    t.true(Array.isArray(routesList));
    t.is(routesList.length, 3);
    t.deepEqual(routesList[0], {method: 'POST', path: '/api/v1/user'});
    t.deepEqual(routesList[1], {method: 'GET', path: '/api/v1/user'});
    t.deepEqual(routesList[2], {method: 'PUT', path: '/api/v1/user'});
});
