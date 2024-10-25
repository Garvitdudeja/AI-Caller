import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    first_name : {
        type: String,
    },
    last_name : {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    comapany : {
        type: String,
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    OTP: {
        type: String,
    }


},{
    timestamps: true,
})

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;