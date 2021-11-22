import { Expose } from "class-transformer";
import { IsEmail, IsJWT, IsString, MaxLength } from "class-validator";

abstract class User {
  @Expose()
  @IsString()
  @MaxLength(30)
  username!: string;
  @Expose()
  @IsString()
  @MaxLength(50)
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
  @Expose()
  @IsString()
  @IsEmail()
  email!: string;
}

export interface LoginResult {
  passwordsMatch: boolean;
  token?: string;
}

/**
 * Contains user's account credentials
 * @typedef {object} LoginData
 * @property {string} username - User's username
 * @property {string} password - User's password
 */
export class LoginData extends User {}

/**
 * Used to request a password restoration email
 * @typedef {object} ForgotPasswordData
 * @property {string} email - User's email
 */
export class ForgotPasswordData {
  @Expose()
  @IsString()
  @IsEmail()
  email!: string;
}

/**
 * Tells you which fields are missing and/or invalid
 * @typedef {object} ValidationData
 * @property {array<string>} invalid - Contains the name of the fields that did not pass validation
 * @property {array<string>} missing - Contains the name of the fields that are required but are missing from the body
 */
export class ValidationData {
  invalid!: string[];
  missing!: string[];
}

export class LinkData {
  @Expose()
  @IsString()
  @IsJWT()
  token!: string;
}
