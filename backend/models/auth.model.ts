import { sql } from "../config/db.js";

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

// Hardcoded admin password — replace with bcrypt in production
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Asmah123";

export const AuthModel = {
  async findByEmail(email: string): Promise<AdminUser | null> {
    const rows = await sql`
      SELECT * FROM admin_users WHERE email = ${email} LIMIT 1
    `;
    return (rows[0] as AdminUser) ?? null;
  },

  /**
   * Verify the submitted password.
   * Currently compares against a plain-text env var.
   * Swap out for bcrypt.compare() in production.
   */
  verifyPassword(submitted: string): boolean {
    return submitted === ADMIN_PASSWORD;
  },
};
