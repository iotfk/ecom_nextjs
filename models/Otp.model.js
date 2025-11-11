// import mongoose from "mongoose";
// import { email } from "zod";


// const otpSchema = new mongoose.Schema({
//    email:{
//     type: String,
//     required: true
//    },
//    otp:{
//     type: String,
//     required: true
//    },
//    expiresAt:{
//     type: Date,
//     required: true,
//     default:()  => new Date(Date.now() + 10* 60 * 1000)
//    }
   
// },{timestamps})


// otpSchema.index({expiresAt: 1}, {expireAfterSeconds: 0})

// const OTPModel = mongoose.model.OTP || mongoose.model('OTP', otpSchema, 'otps')

// export default OTPModel



import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  }
}, { timestamps: true }); // ✅ Fixed: object property, not variable

// TTL index for automatic document deletion
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.models.OTP || mongoose.model('OTP', otpSchema, 'otps'); // ✅ Fixed: models (plural)

export default OTPModel;
