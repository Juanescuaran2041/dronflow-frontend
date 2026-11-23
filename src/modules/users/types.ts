// Mirrors the backend auth/user DTOs.
export type Role = 'ADMIN' | 'OPERATOR'

export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  token: string
  role: Role
}

export interface CreateUserRequest {
  userName: string
  password: string
}

export interface UserResponse {
  id: string
  username: string
  role: Role
}
