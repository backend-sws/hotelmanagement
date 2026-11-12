import { useAuthStore } from '@/store/authStore';
import { useTenantStore } from '@/store/tenantStore';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  const activeBusiness = useTenantStore((state) => state.activeBusiness);

  // Superadmins or Business Owners/Admins bypass all permission checks
  const isSuperadminRole = user?.roles?.some((role) => role.name?.toLowerCase() === 'superadmin');
  const isBusinessOwner = !!(activeBusiness?.owner_id && user?.id && activeBusiness.owner_id === user.id);
  const isBusinessAdmin = user?.roles?.some((role) => ['admin', 'business admin', 'owner'].includes(role.name?.toLowerCase()));

  const hasBypass = isSuperadminRole || isBusinessOwner || isBusinessAdmin;

  const hasPermission = (permission: string): boolean => {
    if (hasBypass) return true;
    if (!user?.permissions || !Array.isArray(user.permissions)) return false;
    
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (hasBypass) return true;
    if (!user?.permissions || !Array.isArray(user.permissions)) return false;

    return permissions.some((perm) => user.permissions?.includes(perm));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (hasBypass) return true;
    if (!user?.permissions || !Array.isArray(user.permissions)) return false;

    return permissions.every((perm) => user.permissions?.includes(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperadmin: isSuperadminRole || false,
    isBusinessOwner: isBusinessOwner || false,
  };
}
