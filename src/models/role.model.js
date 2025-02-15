import mongoose from 'mongoose';
import { Roles, Permissions } from '../enum/role.enum.js'; // Correct import for ES modules
import { RolePermissions } from '../utils/role-permission.js'; // Import RolePermissions

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: Object.values(Roles), 
      required: true,
      unique: true,
    },
    permissions: {
      type: [String], 
      enum: Object.values(Permissions), 
      required: true,
      default: function () {
        return RolePermissions[this.name]; 
      },
    },
  },
  {
    timestamps: true,
  },
);

// Create the Role model
const RoleModel = mongoose.model('Role', roleSchema);

export default RoleModel; 
