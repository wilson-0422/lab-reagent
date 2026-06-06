import { getDatabase } from '../config/database';
import { Experiment, CreateExperimentInput } from '../models/experiment';

export class ExperimentService {
  static findAll(): Experiment[] {
    const db = getDatabase();
    return db.prepare(
      `SELECT e.*, u.real_name as user_name FROM experiments e
       JOIN users u ON e.user_id = u.id
       ORDER BY e.created_at DESC`
    ).all() as Experiment[];
  }

  static findById(id: number): Experiment | undefined {
    const db = getDatabase();
    return db.prepare(
      `SELECT e.*, u.real_name as user_name FROM experiments e
       JOIN users u ON e.user_id = u.id
       WHERE e.id = ?`
    ).get(id) as Experiment | undefined;
  }

  static create(input: CreateExperimentInput): Experiment {
    const db = getDatabase();
    const stmt = db.prepare(
      `INSERT INTO experiments (title, user_id, category, description, procedure, result, conclusion, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(
      input.title,
      input.user_id,
      input.category,
      input.description || null,
      input.procedure || null,
      input.result || null,
      input.conclusion || null,
      input.status || '草稿'
    );
    return this.findById(result.lastInsertRowid as number)!;
  }

  static update(id: number, input: Partial<CreateExperimentInput>): Experiment | undefined {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (input.title !== undefined) { fields.push('title = ?'); values.push(input.title); }
    if (input.category !== undefined) { fields.push('category = ?'); values.push(input.category); }
    if (input.description !== undefined) { fields.push('description = ?'); values.push(input.description); }
    if (input.procedure !== undefined) { fields.push('procedure = ?'); values.push(input.procedure); }
    if (input.result !== undefined) { fields.push('result = ?'); values.push(input.result); }
    if (input.conclusion !== undefined) { fields.push('conclusion = ?'); values.push(input.conclusion); }
    if (input.status !== undefined) { fields.push('status = ?'); values.push(input.status); }
    if (fields.length === 0) return this.findById(id);
    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(id);
    db.prepare(`UPDATE experiments SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM experiments WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static count(): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COUNT(*) as count FROM experiments').get() as any;
    return row.count;
  }

  static countByStatus(status: string): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COUNT(*) as count FROM experiments WHERE status = ?').get(status) as any;
    return row.count;
  }
}
