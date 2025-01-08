require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_USER_SECRET;
console.log(JWT_SECRET)

async function userMiddleware(req, res, next) {
    try{
    const token = req.headers.authorization;
    console.log(token)
    
    if(!token) {
        return res.status(403).json({
            message: "Authorization token not found"
        });
    }
    const decodedInfo = jwt.verify(token, JWT_SECRET);
    console.log("decoded Token:" + decodedInfo);

   
    
    if(decodedInfo){
        req.userId = decodedInfo.id;
        next();
    }else{
        return res.status(404).json({ 
            Message: "you are not logged in"
        })
    }
}catch(err) {
    res.status(500).json({
        error: err.message
    })
}
}

module.exports = userMiddleware;