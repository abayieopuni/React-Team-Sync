import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.config.js';
import RoleModel from '../models/role.model.js';
import { RolePermissions } from '../utils/role-permission.js';

const seedRoles = async () => {
  console.log('Seeding roles started..... ');

  try {
    await connectDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    console.log('Clearing existing roles');
    await RoleModel.deleteMany({}, { session });

    for (const roleName in RolePermissions) {
      const role = roleName;
      const permission = RolePermissions[role];
          const exitingRole = await RoleModel.findOne({ name: role }).session(
            session,
          );
          if (!exitingRole) {
            const newRole = new RoleModel({
              name: role,
              permission: permission,
            });
            await newRole.save({ session });
            console.log(`Role ${role} added with permission`);
          } else {
            console.log(`Role ${role} already exits`);
          }
    }



    await session.commitTransaction();
    console.log('transaction commited');

    session.endSession();
    console.log('sessioon ended');
  } catch (error) {
    console.error('Error during seedings:', error);
  }
};

seedRoles().catch((error) => console.error(''));
