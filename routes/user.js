const {Router} = require('express');
const userRouter = Router();
const {UserModel, UserCoursesModel, CoursesModel} = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_USER_SECRET;
const userMiddleware = require("../middleware/UserAuth.js");
const {SignupSchema, LoginSchema} = require("../zod.js");


userRouter.post('/signup', async(req, res) => {
    const bodyValidation = SignupSchema.safeParse(req.body);
    if (!bodyValidation.success) {
        return res.status(403).json({
            message: "Incorrect data format",
        });
    }

    const { name, email, password } = req.body;
    const user = await UserModel.findOne({email: email});
    if(user){
        return res.status(403).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
        name: name,
        email: email,
        password: hashedPassword
    })
    res.json({message: "you're signed up"})
});

userRouter.post('/login', async(req, res) => {
    try {

        const bodyValidation = LoginSchema.safeParse(req.body);
    if (!bodyValidation.success) {
        return res.status(403).json({
            message: "Incorrect data format"
        });
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({email: email});
    if (!user) {
        return res.status(404).json({ message: "wrong credentials" });
    }

    const passwrodCheck = await bcrypt.compare(password, user.password);
    if(user && passwrodCheck === true){
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET);

        res.json({
            message: "you are logged in",
            token : token
        })

    }else{
        res.json({message: "wrong credentials"})
    }
}catch(err){
    res.json({message: "something went wrong"+ err})
}});

userRouter.get('/Purchase',userMiddleware, async(req, res) => {
    try{
        const userId = req.userId;
        const purchasedCourses = await UserCoursesModel.find({userId: {"$in":userId}});
        if(!purchasedCourses){
            return res.json({message: "you have not purchased any course"})
        }else{
            const purchasedCoursesIds = purchasedCourses.map(x => x.courseId);
            
            const coursesData = await CoursesModel.find({_id:{"$in":purchasedCoursesIds}})
            const formatedData = coursesData.map(x => ({
                ImgUrl: x.imageUrl,
                title: x.title,
                content: x.content,
                authorName: x.author
            }));
            res.json({message: "You have all these courese", Courses: formatedData})
        }
    } catch(err){
        res.status(500).json({message: err.message})
    }
});

module.exports = userRouter;