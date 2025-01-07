const {z} = require("zod");


const SignupSchema = z.object({
    name: z.string(1,"Name is required").min(3),
    email: z.string().email("invalid email format").min(5),
    password: z.string().min(5).max(15).regex(/\d/, {message:"Password must contain at least one number"}).regex(/[!@#$%^&*(),.?":{}|<>]/, {message: "Password must conatain at least 1 special character"})
});

const LoginSchema = z.object({
    email: z.string().email("invalid email format").min(5),
    password: z.string().min(5).max(15).regex(/\d/, {message:"Password must contain at least one number"}).regex(/[!@#$%^&*(),.?":{}|<>]/, {message: "Password must conatain at least 1 special character"})
}); 

module.exports = {
    SignupSchema,
    LoginSchema
};