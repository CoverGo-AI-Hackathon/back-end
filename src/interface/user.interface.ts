import { Document } from "mongoose";

export interface IUserDoc extends IUser, Document {}

export interface IUser {
  email: string,
  displayName: string,
  picture: string,
  password?: string,
  role?: [string],
}