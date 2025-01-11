require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_USER_SECRET;

async function userMiddleware(req, res, next) {
    try{
    const token = req.cookies.authorization;
    
    if(!token) {
        return res.status(403).json({
            message: "Authorization token not found"
        });
    }
    const decodedInfo = jwt.verify(token, JWT_SECRET);
    if(decodedInfo){
        req.userId = decodedInfo.id;
        next();
    }else{
        return res.status(404).json({ 
            Message: "you are not logged in"
        })
    }
}catch(err) {
    res.clearCookie('authorization');
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Session expired, please log in again" });
        }
        return res.status(500).json({ error: "Internal server error: " + err.message });
}
}

module.exports = userMiddleware;