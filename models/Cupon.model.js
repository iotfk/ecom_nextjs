
import mongoose from "mongoose";


const cuponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    discountPercent: {
        type: Number,
        required: true,
       
    },
    minShoppingAmount: {
        type: Number,
        required: true,
      
    },
    validity: {
        type: Date,
        required: true,
     
    },

    deletedAt: {
        type: Date,
        index: true,
        default: null
    },

}, { timestamps: true }); 



const CuponModel = mongoose.models.Cupon || 
mongoose.model('Cupon', cuponSchema, 'cupons'); 

export default CuponModel;
