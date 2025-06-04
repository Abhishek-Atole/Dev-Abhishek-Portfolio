
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  username: string;
  email?: string;
  last_login?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (!sessionToken) {
        setIsLoading(false);
        return;
      }

      console.log('Checking admin session with token:', sessionToken);

      // Verify session token
      const { data: session, error } = await supabase
        .from('admin_sessions')
        .select(`
          *,
          admin_users!admin_sessions_admin_user_id_fkey (
            id,
            username,
            email,
            last_login
          )
        `)
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error || !session) {
        console.log('Session check failed:', error);
        localStorage.removeItem('admin_session_token');
        setIsLoading(false);
        return;
      }

      console.log('Session valid:', session);
      if (session.admin_users) {
        setAdminUser(session.admin_users as AdminUser);
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('admin_session_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      console.log('Attempting admin login for username:', username);
      console.log('Current domain:', window.location.origin);

      // Call login edge function
      const response = await fetch('https://kjphoudvjejgzhzohzwu.supabase.co/functions/v1/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcGhvdWR2amVqZ3poem9oend1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTYwNTgsImV4cCI6MjA2Mzc3MjA1OH0.bIBVdLoCiIA7IwE6d_LtAtFI02Re5njRK3nQvdjM24c`,
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return { success: false, error: 'Invalid response from server' };
      }
      
      console.log('Login response data:', result);

      if (!response.ok) {
        return { success: false, error: result.error || `Login failed with status ${response.status}` };
      }

      if (!result.sessionToken || !result.user) {
        return { success: false, error: 'Invalid response format from server' };
      }

      // Store session token
      localStorage.setItem('admin_session_token', result.sessionToken);
      setAdminUser(result.user);

      console.log('Login successful, user:', result.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: `Network error: ${error.message}` };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (sessionToken) {
        console.log('Logging out admin user');
        // Delete session from database
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_session_token');
      setAdminUser(null);
    }
  };

  const value: AdminAuthContextType = {
    adminUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!adminUser,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
