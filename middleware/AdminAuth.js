require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_ADMIN_SECRET;

async function adminMiddleware(req, res, next) {
    try{
    const token = req.headers.token;
    if(!token) {
        return res.status(403).json({
            message: "Authorization token not found"
        });
    }

    const decodedInfo = jwt.verify(token, JWT_SECRET)
    if(decodedInfo){
        req.adminId = decodedInfo.id;
        next();
    }else{
       return res.status(404).json({
            Message: "you are not logged in"
        })
    }
} catch(err) {
    res.staus(500).json({
        error: err.message
    })
}
}

module.exports = adminMiddleware;