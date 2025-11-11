import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// export const response = (success, statusCode, message, data = {}) => {
//   return NextResponse.json({
//     success, 
//     statusCode, 
//     message, 
//     data
//   }, { status: statusCode });
// };

// export const catchError = (error, customMessage) => {
//   let statusCode = error.code === 11000 ? 409 : 500;
//   let errorObj = {};

//   if (error.code === 11000) {
//     const keys = Object.keys(error.keyPattern || {}).join(',');
//     errorObj.message = `Duplicate field ${keys}, these field values must be unique`;
//   } else {
//     errorObj.message = customMessage || error.message || "Internal server error";
//   }

//   if (process.env.NODE_ENV === "development") {
//     errorObj.error = error.stack || error;
//   }

//   return response(false, statusCode, errorObj.message, errorObj);
// };

// export const generateOTP = () => {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   return otp;
// };

// ✅ Authentication helper
export const isAuthenticated = async (requiredRole = null) => {
  try {
    const cookieStore = await cookies();
    
    if (!cookieStore.has('access_token')) {
      return {
        isAuth: false,
        message: 'No access token found. Please login.'
      };
    }
    
    const access_token = cookieStore.get('access_token');

    const { payload } = await jwtVerify(
      access_token.value, 
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    
    console.log('JWT Payload:', payload);
  
    if (requiredRole && payload.role !== requiredRole) {
      return {
        isAuth: false,
        message: `Access denied. Required role: ${requiredRole}, User role: ${payload.role}`
      };
    }

    return {
      isAuth: true,
      userId: payload._id,
      role: payload.role,
      email: payload.email
    };
  
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      isAuth: false,
      message: error.message || 'Invalid or expired token'
    };
  }
};
