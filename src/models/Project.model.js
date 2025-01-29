import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  emoji: {
    type: String,
    reqired: false,
    trim: true,
    default: '📊',
  },

  description: {
    type: String,
    trim: true,
    required: false
  },
  workspace: {
    type: Schema.Types.ObjectId,
    ref: "workspace",
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required : true,
  },
},
  {
    timestamps : true,
  }

);

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;