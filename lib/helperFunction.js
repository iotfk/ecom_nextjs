import { jwtVerify } from "jose";


import { NextResponse } from "next/server"


export const response = (success, statusCode, message, data={})=>{
    return NextResponse.json({
        success, statusCode, message, data
    })
}

 
export const catchError = (error, customMessage) => {
  // Handle duplicate key error
  let statusCode = error.code === 11000 ? 409 : 500;
  let errorObj = {};

  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern || {}).join(',');
    errorObj.message = `Duplicate field ${keys}, these field values must be unique`;
  } else {
    errorObj.message = customMessage || error.message || "Internal server Error";
  }

  if (process.env.NODE_ENV === "development") {
    errorObj.error = error;
  }

  return response(false, statusCode, errorObj.message, errorObj);
};


// export const catchError= (error, customMessage)=>{

//             // handling duplicate key Error
//             if (error.code === 11000) {
//                 const keys = Object.keys(error.keyPattern).join(',')
//                 error.message = `Duplicate field ${keys}, These field value must be unique`
//             }

//             let errorObj = {}

//             // handling duplicate key Error
//             if (process.env.NODE_ENV === 'development') {
//                errorObj = {
//                 message :error.message,
//                 error
//                }
//             }else{
//                  errorObj = {
//                 message :error.customMessage || "internal server Error",
//                 error
//                }
//             }

//             return NextResponse({
//               success : false,
//               statusCode: error.code,
//               ...errorObj
//             })
// }

export  const generateOTP =()=>{
    const otp = Math.floor(100000 + Math.random() *900000  ).toString()
    return otp
}



export const columnConfig = (columns,
   isCreatedAt = false,
    isUpdatedAt = false,
    isDeletedAt = false,
  )=>{
    
    const newColums = [...columns]
    if(isCreatedAt){
        newColums.push({
            accessorKey: "createdAt",
            header: "Created At",
             Cell:({ renderedCellValue })=>(new Date(renderedCellValue).toLocaleDateString())
          })
    }
    if(isUpdatedAt){
        newColums.push({
            accessorKey: "updatedAt",
            header: "Updated At",
             Cell:({ renderedCellValue })=>(new Date(renderedCellValue).toLocaleDateString())
          })
    }
    if(isDeletedAt){
        newColums.push({
            accessorKey: "deletedAt",
            header: "Deleted At",
             Cell:({ renderedCellValue })=>(new Date(renderedCellValue).toLocaleDateString())
          })
    }
    return newColums
}