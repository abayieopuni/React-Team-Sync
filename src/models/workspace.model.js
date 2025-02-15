import mongoose, { Schema } from "mongoose";
import { generatInvitecode } from "../utils/uuid.js";

const workspaceSchema = new Schema({
  name: {
    type: String,
    trim: true,
    require: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  description: {
    type: String,
    trim: true,
    required: false
  },
  invitecode: {
    type: String,
    required: true,
    unique: true,
    default: generatInvitecode
  }
},
  {
    timestamps: true,
  }
)

workspaceSchema.methods.resetInviteCode = function () {
  this.invitecode = generatInvitecode();
}



const workspacemodel = mongoose.model("Workspace", workspaceSchema);

export default workspacemodel