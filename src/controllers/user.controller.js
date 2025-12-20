import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });// No nee to validate password here before saving
        //  because we are only updating the refreshToken field

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }

}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler( async (req, res) => {
// get email or username and password from req body
// validation - not empty
// check if user exists with email or username
// match password
// generate tokens - access and refresh
//save refresh token in database
//send cookie
const{username,email,password} = req.body
if(!(username || email)){
    throw new ApiError(400, "Username or email is required")
}

const  user = await User.findOne({
    $or:[{username},{email}]
})

if(!user){
    throw new ApiError(404, "User not found")
}


const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
}


const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

const options={
    httpOnly:true,
    secure:true
}
res.status(200)
.cookie("refreshToken",refreshToken,options)
.cookie("accessToken",accessToken,options)
.json(
    new ApiResponse(
        200,
        {
            user:loggedInUser,
            refreshToken,
            accessToken
        },
        "User logged in successfully"

    )
)

})

const logoutUser = asyncHandler( async (req, res) => {
    // clear cookies
    // remove refresh token from db
    // return res
    await User.findByIdAndUpdate(
        req.user._id,
        {
           $set:{
            refreshToken: undefined
           } 
        },{
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true     
    }
    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out successfully")
    )
})

const refreshAccessToken = asyncHandler(async(req,res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized: No token provided");
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
         
     )
     const user = await User.findById(decodedToken?._id);
     if(!user){
         throw new ApiError(401,"Invalid Refresh Token");
     }
     if(user?.refreshToken !== incomingRefreshToken){
         throw new ApiError(401,"Refresh Token is expired or used");
     }
 
 const options={
     httpOnly:true,
     secure:true
 }
 
 const {accessToken, newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
 res.status(200)
 .cookie("refreshToken",newRefreshToken,options)
 .cookie("accessToken",accessToken,options)
 .json(
     new ApiResponse(
         200,
         {
             accessToken,
             refreshToken:newRefreshToken
 
         }
         ,"Access token refreshed successfully"
     )
 
 )
 
   } catch (error) {
    throw new ApiError(401,error?.message || " Invalid refresh token");
   }});

   const changeCurrentUserPassword = asyncHandler(async(req,res) => {
    const {currentPassword,newPassword} = req.body;
    if(!currentPassword || !newPassword){
        throw new ApiError(400,"Both current and new passwords are required");
    }
    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if(!isPasswordValid){
        throw new ApiError(400,"Current password is incorrect");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:true});
    return res.status(200)
    .json(
        new ApiResponse(200,{},"Password changed successfully")
    )
})

const getCurrentUserProfile = asyncHandler(async(req,res) => {
    return res.status(200).json({
        data:req.user,
        message:"Current user profile fetched successfully"
    })
})

const updateUserProfileDetails = asyncHandler(async(req,res) => {
    const {fullName,email} = req.body;
    if(!fullName || !email){
        throw new ApiError(400,"Full name and email are required");
    }
    const updatedUser = await User.findByIdAndUpdate( 
        req.user._id,
    {
        $set:{
            fullName,
            email
        }
    },
    {new:true}).select("-password -refreshToken");

    return res.status(200)
    .json(
        new ApiResponse(200,updatedUser,"Profile updated successfully")
    )
})

const updateUserAvatar = asyncHandler(async(req,res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(500,"Error uploading avatar to cloudinary");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password -refreshToken");
    return res.status(200)
    .json(
        new ApiResponse(200,updatedUser,"Avatar updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req,res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage){
        throw new ApiError(500,"Error uploading cover image to cloudinary");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password -refreshToken");
    return res.status(200)
    .json(
        new ApiResponse(200,updatedUser,"Cover image updated successfully")
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUserProfile,
    updateUserProfileDetails,
    updateUserAvatar,
    updateUserCoverImage
}
