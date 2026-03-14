import {Donor} from "../models/donors.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Admin} from "../models/admin.models.js";
import {Request} from "../models/request.model.js";
export const AddDonor = asyncHandler(async (req, res) => {
    const { name, contact, city,bloodGroup , lastDonationDate } = req.body;

    if (!name || !contact || !bloodGroup) {
        throw new ApiError(400, "All fields are required");
    }

    const donor = await Donor.create({
        name,
        city,
        contact,
        bloodGroup,
        lastDonationDate
    });

    return res.status(201).json(
        new ApiResponse(201, donor, "Donor added successfully")
    );
});
export const GetAllDonors = asyncHandler(async (req, res) => {
    const donors = await Donor.find();
    if(!donors){
        throw new ApiError(404, "No donors found");
    }
    return res.status(200).json(
        new ApiResponse(200, donors, "Donors retrieved successfully")
    );
})
export const createRequest= asyncHandler(async (req, res) => {
    const { patientName, bloodGroup, city, unitsRequired, contactNumber } = req.body;

    if (!patientName || !bloodGroup || !city || !unitsRequired || !contactNumber) {
        throw new ApiError(400, "All fields are required");
    }
    const request = await Request.create({
        patientName,
        bloodGroup,
        city,
        unitsRequired,
        contactNumber
    });
    return res.status(201).json(
        new ApiResponse(201, request, "Request created successfully")
    );
});
export const GetAllRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find();
    if(!requests){
        throw new ApiError(404, "No requests found");
    }
    return res.status(200).json(
        new ApiResponse(200, requests, "Requests retrieved successfully")
    );
});
export const updateRequestStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    return res.status(200).json(
        new ApiResponse(200, request, "Request status updated successfully")
    );
});


// generate access and refresh tokens bec we will use this  many times so we creat it in a method
export const generateAccessAndRefreshTokens= async(userId)=>
{
    try{
         const user=await Admin.findById(userId)
         const accessToken=user.generateAccessToken()
         const refreshToken= user.generateRefreshToken()  //db mai bi save karte hai kuki bar bar password na karna pade

         user.refreshToken= refreshToken           //db mai save karna hai
            await user.save({ validateBeforeSave:false })  //password hash na ho save karte time;


            return { accessToken, refreshToken }
    }
    catch{
        throw new ApiError (500,"something went wrong while generating  R&A tokens")
    }
}

export const registerAdmin=asyncHandler(async(req,res)=>{
    //get user detais from frontend
    //validation (correcet fromat ,not empty)
    //check if users alredy exists:  username or bt email
    //check fir image ,check for avatar
    //upload them to cloudinary,,  cheakin avatar
    //creat user object- creafe entry in db
    //remove password and refersh token field from response
    //check fro user creation
    //return res


    const {fullname,email,password}=req.body
    

    if(
       [fullname,email, password].some((field)=>   //some true return krdega
        field?.trim() ==="")
      
     ) {
        throw new ApiError(400,"all fields are required")
     }


 
 const existedUser=  await Admin.findOne({          //step 3 
    $or:[ { email }]
})     
   if(existedUser){
    throw new ApiError (409,"User already exists with this username or email")
   }
   
   

 

 

 
 

 
    const user= await Admin.create({
        fullname,
        email,
        password
    }) 
   const createdUser= await Admin.findById(user._id)
    .select("-password -refreshToken ")          //ky ky nahi chaiye  so we remove password and refresh token as per step 7 

    if(!createdUser){ //check for user creation step 8
        throw new ApiError(500,"something went wrong while registering  the user")
    }
   

    //step 9
    return res.status(201).json(
        new ApiResponse(201,createdUser,"user registered successfully")
    )


})

// export const loginAdmin=asyncHandler(async(req,res)=>{
//     //dats from frontend
//     //usename and password
//     //find user by 
//     //password match
//     // access token and refresh token
//     //send cookie in response
    

//     const {email,fullname, password }= req.body;
    
//     if(!( email)){
//         throw new ApiError (400,"username and email are required");
//     }
    
//     const user= await Admin.findOne({    //findone used for single entry jo pehele milega husko swnd kar dega
//         $or:[ { fullname },{ email }]
//     })

//     if(!user){
//         throw new ApiError(404,"user not found with this username or email")
//     }  
    
//     const isPasswordValid= await user.isPasswordCorrect(password);
//     if(!isPasswordValid){
//         throw new ApiError(401,"invalid password")
//     }

//     //generate tokens 
//     const { accessToken, refreshToken }= await generateAccessAndRefreshTokens (user._id);

//     //send cookie in response  ()
    
//     const loggedInUser=await Admin.findById(user._id).      //loggedinuser ke pass sara fields honge except password and refresh token
//     select("-password -refreshToken");


//     const options={
//         httpOnly:true,          //only server can access it
//         secure:true,
//     }

//     return res.status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//         new ApiResponse(200,
//             {
//                 user: loggedInUser,
//                 accessToken,
//                 refreshToken
//             },
//             "user logged in successfully"
//         )
//     )




// });


export const loginAdmin = asyncHandler(async (req, res) => {

    // get data from frontend
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // find user by email
    const user = await Admin.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    // generate tokens
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);

    // remove sensitive fields
    const loggedInUser = await Admin.findById(user._id)
        .select("-password -refreshToken");

    // cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    // send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});



export const logoutAdmin=asyncHandler(async(req,res)=>{
    
   await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },

        {
            new:true
        }
   )
//cookie clear
   const options={
        httpOnly:true,          //only server can access it
        secure:true,
    }
 

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200,{},"user logged out successfully")
    )

})
   
