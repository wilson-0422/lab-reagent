export interface User {
  id: number;
  username: string;
  password: string;
  real_name: string;
  role: string;
  department: string | null;
  created_at: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  real_name: string;
  role?: string;
  department?: string;
}
