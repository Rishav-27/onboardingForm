import { supabase } from '@/lib/supabase-client';

export interface Employee {
  employee_id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  profile_image_url?: string;
  auth_user_id?: string;
}

export interface AuthResult {
  success: boolean;
  employee?: Employee;
  error?: string;
  requiresAuth?: boolean;
}

export class AuthService {
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static async isEmployeeEmail(email: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/auth/validate-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.isValid;
    } catch {
      return false;
    }
  }

  static async sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate email format
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Check if email exists in employee database
      const isEmployee = await this.isEmployeeEmail(email);
      if (!isEmployee) {
        return { success: false, error: 'No employee account found with this email address' };
      }

      // Send magic link with email verification
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false // Only allow existing users
        }
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('Invalid email')) {
          return { success: false, error: 'Please enter a valid email address' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address first' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Failed to send magic link' };
    }
  }

  static async loginWithCredentials(identifier: string, password: string): Promise<AuthResult> {
    try {
      // Check if identifier is email or employee ID
      const isEmail = identifier.includes('@');

      if (isEmail) {
        // Direct email login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.toLowerCase().trim(),
          password
        });

        if (error || !data.user) {
          return { success: false, error: error?.message || 'Invalid email or password' };
        }

        return {
          success: true,
          employee: {
            employee_id: data.user.user_metadata?.employee_id || data.user.id,
            full_name: data.user.user_metadata?.full_name || '',
            email: data.user.email || '',
            role: data.user.user_metadata?.role || 'user',
            department: data.user.user_metadata?.department || '',
            profile_image_url: data.user.user_metadata?.avatar_url || null,
            auth_user_id: data.user.id
          },
          requiresAuth: false
        };
      } else {
        // Employee ID login - need to get email first
        const response = await fetch('/api/auth/login-employee-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeId: identifier, password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          return { success: false, error: errorData.error || 'Invalid employee ID or password' };
        }

        const data = await response.json();
        return {
          success: true,
          employee: data.employee,
          requiresAuth: false
        };
      }
    } catch {
      return { success: false, error: 'Login failed' };
    }
  }

  static async linkOAuthUser(email: string, authUserId: string): Promise<AuthResult> {
    try {
      const response = await fetch('/api/auth/link-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, authUserId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to link account' };
      }

      const employee = await response.json();

      return {
        success: true,
        employee,
        requiresAuth: false
      };
    } catch {
      return { success: false, error: 'Failed to link account' };
    }
  }

  static async getEmployeeById(employeeId: string): Promise<Employee | null> {
    try {
      const response = await fetch(`/api/profile?employeeId=${employeeId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  static async createEmployee(employeeData: Record<string, unknown>): Promise<{ success: boolean; employee?: Employee; error?: string }> {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to create employee' };
      }

      const data = await response.json();
      return { success: true, employee: data.employee };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
