import { jwtDecode } from 'jwt-decode';

// Returns decoded token or null
export function getDecodedToken() {
  try {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token || typeof token !== 'string') return null;
    return jwtDecode(token);
  } catch (err) {
    console.error('getDecodedToken error:', err);
    return null;
  }
}

// Returns true if decoded token indicates admin role. Adjust checks to your payload shape.
export function isAdmin() {
  const decoded = getDecodedToken();
  if (!decoded) return false;
  // Common shapes: { role: 'admin' } or { roles: ['admin'] }
  if (decoded.role && decoded.role === 'admin') return true;
  if (Array.isArray(decoded.roles) && decoded.roles.includes('admin')) return true;
  return false;
}
