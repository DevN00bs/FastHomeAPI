abstract class User {
  username!: string;
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
  email!: string;
}

export interface LoginResult {
  passwordsMatch: boolean
  token?: string
}

export class LoginData extends User {}