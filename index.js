require('dotenv').config();
const express = require('express');
const auth = require('./auth.js');
const mongoose = require('mongose');
const { AdminModel, CoursesModel, UserModel, UserCoursesModel } = require('./db.js');

const app = express();

app.use(express.json());

app.post('/singup', async(req, res) => {

});

app.post('/login', async(req, res) => {

});

app.get('/courses', async(req, res) => {

});

app.post('/Purchase', async(req, res) => {

});

//routes for admin

app.post('/adminSignup', async(req, res) => {

})

app.post('/adminLogin', async(req, res) => {

})

app.post('/addCourse', async(req, res) => {

})

app.post('/deleteCourse', async(req, res) => {

})

app.post('/courseContent/:courseId', async(req, res) => {

})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`this server is running at http://localhost:${PORT}`))