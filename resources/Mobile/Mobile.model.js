import mongoose from "mongoose";

const MobileNumberSchema = mongoose.Schema({
    mobile_number: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    questions: [{
        ques: {
            type: String,
            required: true
        },
        ans: {
            type: String,
            required: true
        }
    }],
    voice: {
        type: String,
        default: 'Polly.Joanna'
    },
    question_to_ask: [String]
}, { timestamps: true });

const MobileNumberModel = mongoose.model("MobileNumber", MobileNumberSchema);
export default MobileNumberModel;


