import mongoose, { Schema } from "mongoose"
import { compareValue, hashValue } from "../utils/bcrypt.js";


const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      select: true
    },
 
    profilePicture: {
      type: String,
      default: null
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref :"workspace"
    },
    isActive: {
      type: Boolean,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password)
    }
  };  
})

userSchema.methods.omitPassword = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
  
}

userSchema.methods.comparePassword = async function (value) {
  return compareValue(value , this.password)
}

const userModel = mongoose.model("User", userSchema);

export default userModel;