import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js'; 
import bcrypt from 'bcryptjs';
import ApiError from '../utils/ApiError.utils.js';
import ApiResponse from '../utils/ApiResponse.utils.js';
import asyncHandler from '../utils/asyncHandler.utils.js';


const registerUser = asyncHandler(async (req, res) => {
    let { username, password, email } = req.body;

    //validate user
    if( !username || !password || !email )
        throw new ApiError( 400, "All fields are required!" );

    const existingUser = await User.findOne({ email });
    if(existingUser)
        throw new ApiError( 400, "User already found!" );

    //Salting
    const salt = await bcrypt.genSalt(10);

    //Haisng the password
    const hashedPassword = await bcrypt.hash( password, salt);

    //Creating new User
    const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
    })

    //Token Generation
    const token = jwt.sign({ email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
    );

    //Cookie Storage
    res.cookie( "token", token, {
        //Prevent JS access
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "Production" ? "None" : "Lax", 
    });

    const { password: _, ...userWithoutPassword } = newUser._doc;

    return res.status(201).send( new ApiResponse( 201, { user: userWithoutPassword }, "Successfully Registered.")) 
});


const loginUser = () => {

};


const logoutUser = () => {

};

const checkLog = () => {

};

export {
    registerUser,
    loginUser,
    logoutUser,
    checkLog,
}

