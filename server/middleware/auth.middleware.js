import express from 'express';
import asyncHandler from '../utils/asyncHandler.utils';
import ApiError from '../utils/ApiError.utils';
import ApiResponse from '../utils/ApiResponse.utils';

const verifyJWT = asyncHandler( async(req, res) => {
    try {
        const accessToken = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    } catch(err) {
        
    }
});

export {verifyJWT}