export interface LoginResult {
  passwordsMatch: boolean;
  token?: string;
}

export interface ControllerResponse<T> {
  isSuccessful: boolean;
  result?: T;
}
