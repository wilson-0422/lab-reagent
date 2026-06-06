import { getDatabase } from '../config/database';
import { HazardChemical, HazardLog, CreateHazardInput } from '../models/hazardChemical';

export class HazardService {
  static findAll(): HazardChemical[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM hazard_chemicals ORDER BY created_at DESC').all() as HazardChemical[];
  }

  static findById(id: number): HazardChemical | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM hazard_chemicals WHERE id = ?').get(id) as HazardChemical | undefined;
  }

  static create(input: CreateHazardInput): HazardChemical {
    const db = getDatabase();
    const stmt = db.prepare(
      `INSERT INTO hazard_chemicals (name, cas_number, hazard_class, un_number, risk_phrase, safety_phrase, storage_condition, stock_quantity, location, supervisor)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(
      input.name,
      input.cas_number || null,
      input.hazard_class,
      input.un_number || null,
      input.risk_phrase || null,
      input.safety_phrase || null,
      input.storage_condition || null,
      input.stock_quantity || 0,
      input.location || null,
      input.supervisor || null
    );
    return this.findById(result.lastInsertRowid as number)!;
  }

  static update(id: number, input: Partial<CreateHazardInput>): HazardChemical | undefined {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (input.name !== undefined) { fields.push('name = ?'); values.push(input.name); }
    if (input.cas_number !== undefined) { fields.push('cas_number = ?'); values.push(input.cas_number); }
    if (input.hazard_class !== undefined) { fields.push('hazard_class = ?'); values.push(input.hazard_class); }
    if (input.un_number !== undefined) { fields.push('un_number = ?'); values.push(input.un_number); }
    if (input.risk_phrase !== undefined) { fields.push('risk_phrase = ?'); values.push(input.risk_phrase); }
    if (input.safety_phrase !== undefined) { fields.push('safety_phrase = ?'); values.push(input.safety_phrase); }
    if (input.storage_condition !== undefined) { fields.push('storage_condition = ?'); values.push(input.storage_condition); }
    if (input.stock_quantity !== undefined) { fields.push('stock_quantity = ?'); values.push(input.stock_quantity); }
    if (input.location !== undefined) { fields.push('location = ?'); values.push(input.location); }
    if (input.supervisor !== undefined) { fields.push('supervisor = ?'); values.push(input.supervisor); }
    if (fields.length === 0) return this.findById(id);
    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(id);
    db.prepare(`UPDATE hazard_chemicals SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM hazard_chemicals WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static addLog(hazardId: number, userId: number, action: string, quantity: number, remark?: string): void {
    const db = getDatabase();
    db.prepare(
      'INSERT INTO hazard_logs (hazard_id, user_id, action, quantity, remark) VALUES (?, ?, ?, ?, ?)'
    ).run(hazardId, userId, action, quantity, remark || null);

    if (action === '入库') {
      db.prepare('UPDATE hazard_chemicals SET stock_quantity = stock_quantity + ?, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?').run(quantity, hazardId);
    } else if (action === '领用') {
      db.prepare('UPDATE hazard_chemicals SET stock_quantity = stock_quantity - ?, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?').run(quantity, hazardId);
    }
  }

  static getLogs(hazardId: number): HazardLog[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM hazard_logs WHERE hazard_id = ? ORDER BY created_at DESC').all(hazardId) as HazardLog[];
  }

  static count(): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COUNT(*) as count FROM hazard_chemicals').get() as any;
    return row.count;
  }
}
