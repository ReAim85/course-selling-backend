const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Admin = new Schema({
    name: String,
    email: String,
    password: String
});

const Courses = new Schema({
    title: String,
    author: String,
    authorid: ObjectId,
    price: Number,
    imageUrl: String,
    content: String

});

const User = new Schema({
    name: String,
    email: String,
    password: String
})

const UserCourses = new Schema({
    userId: ObjectId,
    courseId: ObjectId,
    dateOfPurchase: { type: Date, default: Date.now },
    validity: String,
    courseContent: String
})

const AdminModel = mongoose.model('Admin', Admin);
const CoursesModel = mongoose.model('Course', Courses);
const UserModel = mongoose.model('User', User);
const UserCoursesModel = mongoose.model('UserCourse', UserCourses);

module.exports = {
    AdminModel,
    CoursesModel,
    UserModel,
    UserCoursesModel
}