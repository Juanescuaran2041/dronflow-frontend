import { request } from '../../shared/api/http'
import type { CreateUserRequest, LoginRequest, LoginResponse, UserResponse } from './types'

export const authApi = {
  login: (body: LoginRequest) => request<LoginResponse>('/auth/login', { method: 'POST', body }),
  logout: () => request<void>('/logout', { method: 'POST' }),
}

export const usersApi = {
  create: (body: CreateUserRequest) => request<UserResponse>('/users', { method: 'POST', body }),
}
