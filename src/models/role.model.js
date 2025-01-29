import mongoose from 'mongoose';
import { Roles, Permissions } from '../enums/role.enum.js'; // Correct import for ES modules
import { RolePermissions } from '../utils/role-permission.js'; // Import RolePermissions

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: Object.values(Roles), // Restrict name field to values in the Roles enum
      required: true,
      unique: true,
    },
    permissions: {
      type: [String], // Array of permissions
      enum: Object.values(Permissions), // Restrict permissions to values in the Permissions enum
      required: true,
      default: function () {
        return RolePermissions[this.name]; // Default permissions based on role name
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Create the Role model
const RoleModel = mongoose.model('Role', roleSchema);

export default RoleModel; // Default export for Role model
