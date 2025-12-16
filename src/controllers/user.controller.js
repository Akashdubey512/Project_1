import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser=asyncHandler(async (req,res)=>{
  //get user details from frontened
  //validation
  //check if user already exists by emailand username
  //check for images,check for avatar
  //upload to cloudinary,avatar
  //create user object -create user in db
  //remove password and refresh token from response
  //check for user creation
  //return response
  const{fullName,email,username,password}=req.body
  console.log(email,username);

  //Validation
  if(
    [fullName,email,username,password].some((field)=>
      field?.trim()==="")
  ){
    throw new ApiError(400,"All fields are required")
  }


//Check if user already exists
 const existedUser = User.findOne({
    $or:[{ email },{ username }]
  })
    if(existedUser){ 
        throw new ApiError(409,"User already exists with this email or username")
    }

   const avatarLocalPath = req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log(req.files);

    if(!avatarLocalPath){
        throw new ApiError (400,"Avatar image is required")
    }
    //Upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar image is required")
    }
    //Create user object
    const user= await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        username:username.toLowerCase(),
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -__v"
    )
    if(!createdUser){
        throw new ApiError(500,"User registration failed,please try again")
    }
    

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )




})


export {registerUser}