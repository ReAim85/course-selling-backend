const {Router} = require('express');
const courseRouter = Router();
const { CoursesModel, UserCoursesModel } = require('../db.js');
const userMiddleware = require('../middleware/UserAuth.js')

courseRouter.post('/purchase', userMiddleware, async(req, res) => {
    try{
        const userId = req.userId;
        const { courseId } = req.body;
        if(!courseId){
            res.status(403).json({
                message: "Course Id is required"
            });
        } else {
        await UserCoursesModel.create({
            userId: userId,
            courseId: courseId
        })
        res.json
    }
} catch(err) {
    res.json({
        message: err
    })
}
});

courseRouter.get('/coursespreview', async(req, res) => {
    const allCourses = await CoursesModel.find();

    const formatedData = allCourses.map(allCourse => ({
        ImageUrl: allCourse.imageUrl,
        Title: allCourse.title,
        CourseId: allCourse._id,
        Author: allCourse.author,
        Price: allCourse.price
    }))

    res.json({
        message: "We have these courses",
        formatedData
    })
});

module.exports = courseRouter;