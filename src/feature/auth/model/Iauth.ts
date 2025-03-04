export interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
  gender: string;
  age: number;
}

export interface RegistrationResponse {
  id: number;
  username: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
