// src/utils/validation.ts
export type LoginForm = {
  username: string;
  password: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR' | '';
};

export type RegisterForm = {
  username: string;
  password: string;
  confirmPassword: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR' | '';
  mobileNumber: string;
};

export function validateLogin(form: LoginForm) {
  const errors: Partial<LoginForm> = {};
  if (!form.username || form.username.length < 3 || form.username.length > 50) {
    errors.username = 'Username is required (3-50 chars)';
  }
  if (!form.password || form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (!form.role) {
    errors.role = 'Role is required' as any;
  }
  return errors;
}

export function validateRegister(form: RegisterForm) {
  const errors: Partial<RegisterForm> = {};
  if (!form.username || form.username.length < 3 || form.username.length > 50) {
    errors.username = 'Username is required (3-50 chars)';
  }
  if (!form.password || form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  if (!form.role) {
    errors.role = 'Role is required' as any;
  }
  if (form.mobileNumber && form.mobileNumber.length !== 10) {
    errors.mobileNumber = 'Mobile number must be 10 digits';
  }
  return errors;
}
