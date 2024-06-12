import { Model } from 'mongoose';

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isValidUser: (id: string) => Promise<TUser>;
  isPasswordMatch: (
    plainPassword: string,
    hashPassword: string
  ) => Promise<boolean>;
  isJWTIssuedBeforePasswordChange: (
    changePasswordTimestamp: Date,
    jwtIssuedTimestamp: number
  ) => boolean;
}

// export type UserMethods = {
//   isUserExists(id: string): Promise<TUser | null>;
// };

// export type UserModel = Model<TUser, Record<string, never>, UserMethods>;

export type TRole = {
  student: string;
  admin: string;
  faculty: string;
};
