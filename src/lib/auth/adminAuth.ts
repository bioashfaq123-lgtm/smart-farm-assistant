/**
 * Administrator Access Control Utilities
 * Restricts platform administrative features exclusively to bioashfaq123@gmail.com
 */

export const ADMIN_EMAIL = "bioashfaq123@gmail.com";

/**
 * Returns true only if the currently active user profile or active admin session
 * belongs to bioashfaq123@gmail.com
 */
export function isAuthorizedAdmin(
  profileEmail?: string | null,
  isLoggedIn?: boolean
): boolean {
  // 1. Direct logged-in user check
  const cleanEmail = (profileEmail || "").trim().toLowerCase();
  if (isLoggedIn && cleanEmail === ADMIN_EMAIL) {
    return true;
  }

  // 2. Check saved persistent admin session in localStorage
  if (typeof window !== "undefined") {
    try {
      const session = localStorage.getItem("sf_admin_session_v1");
      if (session) {
        const parsed = JSON.parse(session);
        if (
          parsed?.authenticated === true &&
          parsed?.email?.trim().toLowerCase() === ADMIN_EMAIL
        ) {
          return true;
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return false;
}
