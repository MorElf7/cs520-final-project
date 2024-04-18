import { DataResponse } from "../interfaces/IResponse";
import { IUser } from "../interfaces/IUser";
import { SaveUserRequest } from "../interfaces/IRequest";
import { checkUser } from "../utils/checkUtility";
import { User } from "../models/User";
import { HydratedDocument } from "mongoose";

export class UserService {
  static async getUserById(userId: string): Promise<DataResponse<IUser>> {
    const user = await checkUser({ _id: userId });
    return { data: user.toJSON() };
  }

  static async saveUser(
    payload: SaveUserRequest,
  ): Promise<DataResponse<IUser>> {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      education,
      experience,
      links,
      equalOp,
    } = payload;
    let savedUser: HydratedDocument<IUser>;
    if (id) {
      const user = await checkUser({ _id: id });
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.experience = experience || user.experience;
      user.education = education || user.education;
      user.links = links || user.links;
      user.equalOp = equalOp || user.equalOp;

      savedUser = await user.save();
    } else {
      savedUser = await User.create({
        firstName,
        lastName,
        email,
        phone,
        education,
        experience,
      });
    }
    return { data: savedUser.toJSON() };
  }
}