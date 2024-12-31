require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function userMiddleware(req, res, next) {
    const token = req.headers.token;
    if(!token) {
        res.status(403).json({
            message: "Authorization token not found"
        });
    }

    const decodedInfo = jwt.verify(token, JWT_SECRET)
    req.username = decodedInfo.username;
    if(req.username){
        next();
    }else{
        res.status(404).json({
            Message: "you are not logged in"
        })
    }
}

module.exports = userMiddleware;