// Admin utilities
export const ADMIN_EMAIL = "r.difalco@lori-crm.it";

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
