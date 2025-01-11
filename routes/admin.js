const {Router} = require('express');
const adminRouter = Router();
const {AdminModel, CoursesModel} = require('../db.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_ADMIN_SECRET;
const {SignupSchema, LoginSchema} = require("../zod.js");
const adminAuthMiddleware = require('../middleware/AdminAuth.js');
const bcrypt = require('bcrypt');

adminRouter.post('/Signup', async(req, res) => {
    try{
    const bodyValidation = SignupSchema.safeParse(req.body);
    if (!bodyValidation.success) {
        return res.status(403).json({
            message: "Incorrect data format"
        });
    }

    const { name, email, password } = req.body;
    const admin = await AdminModel.findOne({email: email});

    if(admin){
        return res.status(403).json({
            message: "Admin already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
        await AdminModel.create({
        name: name,
        email: email,
        password: hashedPassword
    })

    res.json({message: "you're signed up"})
} catch(err){
    res.json({err:err})
}
});

adminRouter.post('/login', async(req, res) => {
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

        const admin = await AdminModel.findOne({email: email});
        if (!admin) {
            return res.status(404).json({ message: "wrong credentials" });
        }

        const passwrodCheck = await bcrypt.compare(password, admin.password);
        if(admin && passwordCheck === true){
            const token = jwt.sign({
                id: admin._id
            }, JWT_SECRET);

            res.cookie('authorization', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: true
            });
            res.json({
                message: "you are logged in",
                token : token
            })

        }else{
            res.status(401).json({message: "wrong credentials"})    
        }

    } catch(err){
        res.json({message: "something went wrong"+ err})
    }

    });

adminRouter.post('/addCourse', adminAuthMiddleware, async(req, res) => {
    try{
        const adminId = req.adminId;
        const author = await AdminModel.find({_id: adminId})
        const authorName = author.map(x=> x.name);

        const { title, content, imageUrl, price } = req.body;

        const course = await CoursesModel.create({
            title,
            author:authorName[0],
            authorid: adminId,
            price,
            imageUrl,
            content
        })

        res.json({
            message: "added course successfully",
            courseID: course._id
        });
    } catch(err){
        res.json({err: err})
    }

})

adminRouter.delete('/deleteCourse', adminAuthMiddleware, async(req, res) => {
    try{
        const adminId = req.adminId;
        const { courseId } = req.body;
        const ownerShip = await CoursesModel.findOne({_id: courseId});
        
        if(!courseId) {
            res.status(403).json({
                message: "courseId is required"
            });
        } else {
            if (ownerShip.authorid.toString() === adminId){
                await CoursesModel.deleteOne({
                    _id: courseId
                });
    
                res.json({
                    message: "course deleted successfully"
                });
            } else {
                res.status(403).json({message: "You are not authorized"})
            };
            
        };
    
    } catch (err) {
        res.json({
            message: "course does not exist"
        });
    };
});

adminRouter.put('/updateCourse', adminAuthMiddleware, async(req, res) => {
    try{
    const adminId = req.adminId;
        const author = await AdminModel.findOne({_id: adminId});
        const authorName = author.name;
        const { title, content, imageUrl, price, courseId } = req.body;
        const ownerShip = await CoursesModel.findOne({_id: courseId});

        const courseExist = await CoursesModel.findOne({_id: courseId});
        if(!courseExist){
            res.status(403).json({message: "course not found"})
        }else{
            if (ownerShip.authorid.toString() === adminId){
                const course = await CoursesModel.updateOne({
                    _id: courseId
                }, { 
                    title,
                    author:authorName,
                    authorid: adminId,
                    price,
                    imageUrl,
                    content
                });
        
                res.json({
                    message: "Updated course successfully",
                    courseID: course._id
                });
            } else {
                res.status(403).json({
                    message: "You are Not authorized"
                })
            } 
    };
    } catch (err){
        res.json({message: "course Does Not exist", error: err});
    };

});

module.exports = adminRouter;