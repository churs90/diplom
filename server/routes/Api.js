const apiRouter = require('express').Router();

apiRouter.use('/auth', require('./Auth'));
apiRouter.use('/user', require('./user'));
apiRouter.use('/discover', require('./Discover'));
apiRouter.use('/post', require('./Post'));
apiRouter.use('/message', require('./Message'));

module.exports = apiRouter;