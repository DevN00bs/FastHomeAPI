import { IsInt } from "class-validator";

export interface LoginResult {
  passwordsMatch: boolean;
  token?: string;
}

export interface ControllerResponse<T> {
  isSuccessful: boolean;
  result?: T;
}

export class IDRequest {
  @IsInt()
  id!: number
}