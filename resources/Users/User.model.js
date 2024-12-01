import mongoose from "mongoose";

// Define Company schema
const CompanySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  most_selling_product: {
    type: String,
    required: true
  }
}, { _id: false }); // Prevents the creation of a separate _id field for company sub-schema

// Define User schema
const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']  // Email validation regex
  },
  password: {
    type: String,
    required: true
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
    required: false
  },
  company: CompanySchema, // Embedded company schema
}, {
  timestamps: true,
});

// Index for quick email lookups
UserSchema.index({ email: 1 });

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
