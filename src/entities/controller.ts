export interface LoginResult {
  passwordsMatch: boolean;
  token?: string;
}

export interface ControllerResponse<T> {
  isSuccessful: boolean;
  result?: T;
}

/**
 * Contains the ID of a property
 * @typedef {object} IDRequest
 * @property {integer} id - ID of the property
 */
export class IDRequest {
  id!: number;
}
