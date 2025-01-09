const {Router} = require('express');
const courseRouter = Router();
const mongoose = require('mongoose')
const { CoursesModel, UserCoursesModel } = require('../db.js');
const userMiddleware = require('../middleware/UserAuth.js')

courseRouter.post('/purchase', userMiddleware, async(req, res) => {
    try{
        const userId = req.userId;
        const courseId = req.body.courseId;
        if(!courseId){
            return res.status(403).json({
                message: "Course Id is required"
            });
        }else{
        const idCheck = mongoose.Types.ObjectId.isValid(courseId);
        if(idCheck === false) {
            res.status(403).json({message: "course doesn't exist"})
        }else{
        const courseExist = await CoursesModel.findById(courseId);
        if(courseExist){
            const courseAlreadyBrought = await UserCoursesModel.findOne({userId:userId , courseId:{"$in":courseId}})
            if(courseAlreadyBrought){
                return res.json({message:"You already have this course"})
            }else{
                await UserCoursesModel.create({
                    userId: userId,
                    courseId: courseId,
                    validity: "3 years from purchasing date"
                })
                res.json({message:"course purchased successfully"})
            }                       
        }else{
            return res.status(403).json({message: "course doesn't exits"})
        }
    }
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