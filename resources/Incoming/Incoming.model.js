import mongoose from "mongoose";

const IncomingSchema = mongoose.Schema({
    From: {
        type: String,
        required: true
    },
    To: {
        type: String,
        required: true
    },
    CallSid: {
        type: String,
        required: true
    },
    Conversation: [{
        assistant: String,
        user: String,
    }]
}, { timestamps: true });

const IncomingModel = mongoose.model("Incoming", IncomingSchema);
export default IncomingModel;


