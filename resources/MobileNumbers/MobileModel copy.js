import { required } from "joi";
import mongoose from "mongoose";

const mobile_number_schema = mongoose.Schema({
   Number: {
    type: String,
    required: true
   },
   user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
   },
   Questions: [{
      ques: {
         type: String,
         required: true
      },
      ans:{
         type: String,
         required: true
      }
   }],
   voice: {
      type: String,
      default: 'Polly.Joanna'
   }


},{timestamps: true,})

const mobile_number_model = mongoose.Model("mobile_numbers", mobile_number_schema);
export default mobile_number_model;