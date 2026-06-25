import { sql } from "../config/db.js";

export interface User {
  id: string;
  google_id: string;
  email: string;
  name: string;
  avatar: string;
  created_at: string;
  last_login: string;
}

export const UserModel = {
  async upsertGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  }): Promise<User> {
    const rows = await sql`
      INSERT INTO users (google_id, email, name, avatar, last_login)
      VALUES (${data.googleId}, ${data.email}, ${data.name}, ${data.avatar}, now())
      ON CONFLICT (google_id) DO UPDATE SET
        name       = excluded.name,
        avatar     = excluded.avatar,
        last_login = now()
      RETURNING *
    `;
    return rows[0] as User;
  },

  async getById(id: string): Promise<User | null> {
    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    return (rows[0] as User) ?? null;
  },
};
