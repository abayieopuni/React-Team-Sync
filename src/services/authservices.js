import mongoose from "mongoose";
import userModel from "../models/user.model.js"; 
import AccountModel from "../models/account.model.js";
import MemberModel from "../models/member.model.js";
import RoleModel from "../models/role.model.js";
import workspacemodel from "../models/workspace.model.js";
import AppErrors from '../utils/appError.js';
import { Roles } from "../enum/role.enum.js";
import { ProviderEnum } from "../enum/account-provider.enum.js";
const { NotFoundException } = AppErrors;



export const loginOrCreateAccountServices = async (data) => {
  const { provider, displayName, providerId, email, picture } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Starting session......")


    let user = await userModel.findOne({ email }).session(session);

    if (!user) {
      user = new userModel({
        email,
        name: displayName,
        profilePicture: picture || null
      });
      await user.save({ session })
      console.log("Created new user:", user)
      console.log('ProviderID:', providerId);

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
       });
      await account.save({ session });
       console.log('Created new account:', account);



      const workspace = new workspacemodel({
        name: " My Workspace",
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      })
      await workspace.save({ session })
      console.log('Created workspace:', workspace);


      
      const ownerRole = await RoleModel.findOne({ name: Roles.OWNER}).session(session);
      if (!ownerRole) {
        throw new NotFoundException("owner role not found")
      }


      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date()
      })
      await member.save({ session });
      console.log("Added user as a member with 'Owner' role:", member);

      user.currentWorkspace = workspace._id;
      await user.save({ session })
      console.log("Updated user's current workspace:", user.currentWorkspace);
    }

    await session.commitTransaction();
    console.log("commiting transactions")
    session.endSession();
    console.log('Session ended.');
    return {user}


  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during transaction:', error);
    throw error; 
  }
}


export const registerServices = async (data) => {
  const {email, password, name } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Starting session......');

    let user = await userModel.findOne({ email }).session(session);

    if (!user) {
      user = new userModel({
        email,
        name,
       password,
      });
      await user.save({ session });
     

      const account = new AccountModel({
        userId: user._id,
        provider: ProviderEnum.EMAIL,
        providerId: email,
      });
      await account.save({ session });

      const workspace = new workspacemodel({
        name: ' My Workspace',
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });
      console.log('Created workspace:', workspace);

      const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
        session,
      );
      if (!ownerRole) {
        throw new NotFoundException('owner role not found');
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });
   

      user.currentWorkspace = workspace._id;
      await user.save({ session });
      console.log("Updated user's current workspace:", user.currentWorkspace);
    }

    await session.commitTransaction();
    console.log('commiting transactions');
    session.endSession();
    console.log('Session ended.');
    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during transaction:', error);
    throw error;
  }
};


