const {Router} = require('express');
const userRouter = Router();
const {UserModel} = require('../db.js')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
JWT_SECRET = process.env.JWT_SECRET;


userRouter.post('/signup', async(req, res) => {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({email: email});
    console.log(user);

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
        const token = JWT.sign({
            id: user._id
        }, JWT_SECRET);
    
        res.json({
            message: "you are logged in",
            token : token
        })
    }else{
        res.json({message: "wrong credentials"})
    }
} catch(err){
    res.json({message: "something went wrong"+ err})
}
});

userRouter.post('/Purchase', async(req, res) => {
    res.json({
        message: 'fuck you'
    })
});

module.exports = userRouter;