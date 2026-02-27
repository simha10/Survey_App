import { z } from 'zod';

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10}$/,
  aadhaar: /^[0-9]{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  pincode: /^[0-9]{6}$/,
};

// Survey form validation schemas
export const residentialSurveySchema = z.object({
  ownerName: z.string().min(1, 'Owner name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  constructionType: z.string().min(1, 'Construction type is required'),
  occupancyType: z.string().min(1, 'Occupancy type is required'),
  floorNumber: z.string().min(1, 'Floor number is required'),
  builtUpArea: z.number().positive('Built-up area must be positive'),
  carpetArea: z.number().positive('Carpet area must be positive'),
  yearOfConstruction: z.number().optional(),
  propertyTax: z.number().optional(),
});

export const nonResidentialSurveySchema = z.object({
  ownerName: z.string().min(1, 'Owner/Company name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  businessType: z.string().min(1, 'Business type is required'),
  constructionType: z.string().min(1, 'Construction type is required'),
  floorNumber: z.string().min(1, 'Floor number is required'),
  builtUpArea: z.number().positive('Built-up area must be positive'),
  yearOfConstruction: z.number().optional(),
  monthlyRent: z.number().optional(),
  propertyTax: z.number().optional(),
});

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(patterns.phone, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['surveyor', 'supervisor', 'admin', 'super_admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Validation helper functions
export const validateField = (
  value: string,
  validationType: 'email' | 'phone' | 'required' | 'min' | 'max' | 'custom',
  options?: { min?: number; max?: number; pattern?: RegExp; message?: string }
): string | null => {
  switch (validationType) {
    case 'required':
      return value.trim() ? null : options?.message || 'This field is required';
    
    case 'email':
      return patterns.email.test(value) ? null : options?.message || 'Invalid email address';
    
    case 'phone':
      return patterns.phone.test(value) ? null : options?.message || 'Invalid phone number';
    
    case 'min':
      return value.length >= (options?.min || 0) 
        ? null 
        : options?.message || `Minimum ${options?.min} characters required`;
    
    case 'max':
      return value.length <= (options?.max || 1000) 
        ? null 
        : options?.message || `Maximum ${options?.max} characters allowed`;
    
    case 'custom':
      return options?.pattern?.test(value) 
        ? null 
        : options?.message || 'Invalid format';
    
    default:
      return null;
  }
};

// Format helpers
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
