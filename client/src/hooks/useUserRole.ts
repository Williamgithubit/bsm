import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/store';
import { selectAuthState } from '@/store/Auth/authSlice';
import { UserRole } from '@/types/athlete';

export function useUserRole(): UserRole {
  const { user } = useAppSelector((state) => selectAuthState(state));
  const [userRole, setUserRole] = useState<UserRole>({
    role: 'viewer',
    permissions: {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: true,
      canExport: false,
      canImport: false
    }
  });

  useEffect(() => {
    if (!user) {
      setUserRole({
        role: 'viewer',
        permissions: {
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canView: false,
          canExport: false,
          canImport: false
        }
      });
      return;
    }

    // Get user role from custom claims or user data
    const userClaims = (user as any).customClaims || {};
    let role = userClaims.role;
    
    // Fallback: Check if user email or display name indicates admin
    if (!role) {
      const email = user.email?.toLowerCase() || '';
      const displayName = user.displayName?.toLowerCase() || '';
      
      // Check for admin indicators
      if (email.includes('admin') || displayName.includes('admin') || 
          email === 'admin@benzardsportsmanagement.com' ||
          displayName === 'admin') {
        role = 'admin';
      } else {
        role = 'viewer';
      }
    }

    let permissions = {
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canView: true,
      canExport: false,
      canImport: false
    };

    switch (role) {
      case 'admin':
        permissions = {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canView: true,
          canExport: true,
          canImport: true
        };
        break;

      case 'manager':
        permissions = {
          canCreate: true,
          canEdit: true,
          canDelete: false,
          canView: true,
          canExport: true,
          canImport: true
        };
        break;

      case 'coach':
        permissions = {
          canCreate: false,
          canEdit: true,
          canDelete: false,
          canView: true,
          canExport: true,
          canImport: false
        };
        break;

      case 'athlete':
        permissions = {
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canView: true,
          canExport: false,
          canImport: false
        };
        break;

      default: // viewer
        permissions = {
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canView: true,
          canExport: false,
          canImport: false
        };
    }

    setUserRole({
      role: role as any,
      permissions
    });
  }, [user]);

  return userRole;
}

export default useUserRole;
