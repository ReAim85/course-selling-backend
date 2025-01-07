require('dotenv').config();
const express = require('express');
const userAuthMiddleware = require('./middleware/UserAuth.js');
const adminAuthMiddleware = require('./middleware/AdminAuth.js')
const mongoose = require('mongoose');
const { AdminModel, CoursesModel, UserModel, UserCoursesModel } = require('./db.js');
const userRouter = require('./routes/user.js');
const adminRouter = require('./routes/admin.js');
const couresRouter = require('./routes/course.js');
const DB = process.env.DB;

mongoose.connect(DB);

const app = express();
app.use(express.json())

app.use('/user',userRouter);
app.use('/admin', adminRouter);
app.use('/course', couresRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`This server is running on http://localhost:${PORT}`))