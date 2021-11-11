import { IsEmail, IsJWT, IsString } from "class-validator";

abstract class User {
  @IsString()
  username!: string;
  @IsString()
  password!: string;
}

/**
 * Used to register new users only
 * @typedef {object} RegistrationData
 * @property {string} username - User's username
 * @property {string} email - User's email. Both client and server check if it's valid
 * @property {string} password - User's password. Will be encrypted server-side
 */
export class RegistrationData extends User {
  @IsEmail()
  email!: string;
}

export interface LoginResult {
  passwordsMatch: boolean;
  token?: string;
}

export class LoginData extends User {}

export class ForgotPasswordData {
  @IsEmail()
  email!: string;
}

export class LinkData {
  @IsJWT()
  token!: string;
}
