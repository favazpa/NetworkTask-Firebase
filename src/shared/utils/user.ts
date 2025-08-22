import { useAuthStore } from '../../store/authStore';

export function getDisplayLabel(
  email?: string | null,
  displayName?: string | null,
) {
  if (displayName && displayName.trim().length > 0) return displayName.trim();
  if (email) return email.split('@')[0];
  return 'User';
}

export function getInitials(
  email?: string | null,
  displayName?: string | null,
) {
  const name = getDisplayLabel(email, displayName);
  const parts = name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .split(/\s+/);
  const initials = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return initials.toUpperCase() || 'U';
}

export function getCurrentUserSafe() {
  return useAuthStore.getState().user;
}
