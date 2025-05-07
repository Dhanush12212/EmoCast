import express from 'express';
import asyncHandler from '../utils/asyncHandler.utils';
import ApiError from '../utils/ApiError.utils';
import ApiResponse from '../utils/ApiResponse.utils';
import jwt from 'jsonwebtoken';

const verifyJWT = asyncHandler( async(req, res, next) => { 
        const accessToken = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if(!accessToken) 
            throw new ApiError( 401,"Unauthorized request", ["Acccess token not found!"]);

        let decodedToken = jwt.verify( accessToken, process.env.JWT_SECRET);
        if( !decodedToken)
            throw new ApiError(401, "Invalid Token", ["Token verifiication failed"]);

        req.user = decodedToken; 
        next();
});

export {verifyJWT}