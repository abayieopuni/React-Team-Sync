import { Schema, model } from 'mongoose';

const memberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace', 
      required: true, 
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role', 
      required: true, 
    },
    joinedAt: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true, 
  },
);

// Create a model based on the schema
const MemberModel = model('Member', memberSchema);

export default MemberModel;
