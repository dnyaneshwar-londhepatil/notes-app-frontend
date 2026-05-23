export interface SignUpRequest {
  userName: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  user: User;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  userName?: string;
  email: string;
  password: string;
}
