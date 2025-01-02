const {Router} = require('express');
const adminRouter = Router();

adminRouter.post('/Signup', async(req, res) => {

        res.json({
            message: "fuck you"
        })
})

adminRouter.post('/Login', async(req, res) => {

        res.json({
            message: "fuck you"
        })
})

adminRouter.post('/addCourse', async(req, res) => {

        res.json({
            message: "fuck you"
        })
})

adminRouter.post('/deleteCourse', async(req, res) => {

        res.json({
            message: "fuck you"
        })
})

adminRouter.post('/courseContent/:courseId', async(req, res) => {

        res.json({
            message: "fuck you"
        })
})

module.exports = adminRouter;