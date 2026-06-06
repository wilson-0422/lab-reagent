import bcrypt from 'bcryptjs';
import { getDatabase } from '../config/database';
import { User, CreateUserInput } from '../models/user';

export class UserService {
  static findById(id: number): User | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  }

  static findByUsername(username: string): User | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
  }

  static findAll(): User[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
  }

  static create(input: CreateUserInput): User {
    const db = getDatabase();
    const hashedPassword = bcrypt.hashSync(input.password, 10);
    const stmt = db.prepare(
      'INSERT INTO users (username, password, real_name, role, department) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      input.username,
      hashedPassword,
      input.real_name,
      input.role || 'user',
      input.department || null
    );
    return this.findById(result.lastInsertRowid as number)!;
  }

  static verifyPassword(username: string, password: string): User | null {
    const user = this.findByUsername(username);
    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password)) return null;
    return user;
  }

  static update(id: number, data: Partial<User>): User | undefined {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (data.real_name !== undefined) { fields.push('real_name = ?'); values.push(data.real_name); }
    if (data.department !== undefined) { fields.push('department = ?'); values.push(data.department); }
    if (data.role !== undefined) { fields.push('role = ?'); values.push(data.role); }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }
}
