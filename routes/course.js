const {Router} = require('express');
const courseRouter = Router();

courseRouter.get('/purchase', async(req, res) => {

    res.json({
        message: 'fuck you'
    })
});

courseRouter.get('/coursespreview', async(req, res) => {

    res.json({
        message: 'fuck you'
    })
});

module.exports = courseRouter;