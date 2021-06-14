const Router = require('@koa/router');
const router = new Router();
const auth = require('koa-basic-auth');
const config = require('./config').value;

router.use('/(.*)', auth(config.authentication));

module.exports = router;
