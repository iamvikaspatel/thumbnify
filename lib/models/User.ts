import mongoose, { Schema, Document, Model, Types, model } from "mongoose";

// User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
export interface IUserModel extends Model<IUser> {
  findByClerkId(clerkId: string): Promise<IUser | null>;
  createUser(clerkId: string): Promise<IUser>;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Prevent re-compilation during development
export const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  model<IUser, IUserModel>("User", UserSchema);

export default User;
