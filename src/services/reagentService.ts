import { getDatabase } from '../config/database';
import { Reagent, ReagentLog, CreateReagentInput } from '../models/reagent';

export class ReagentService {
  static findAll(): Reagent[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reagents ORDER BY created_at DESC').all() as Reagent[];
  }

  static findById(id: number): Reagent | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reagents WHERE id = ?').get(id) as Reagent | undefined;
  }

  static create(input: CreateReagentInput): Reagent {
    const db = getDatabase();
    const stmt = db.prepare(
      `INSERT INTO reagents (name, cas_number, category, specification, unit, stock_quantity, min_quantity, location, supplier, price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(
      input.name,
      input.cas_number || null,
      input.category,
      input.specification || null,
      input.unit,
      input.stock_quantity || 0,
      input.min_quantity || 10,
      input.location || null,
      input.supplier || null,
      input.price || null
    );
    return this.findById(result.lastInsertRowid as number)!;
  }

  static update(id: number, input: Partial<CreateReagentInput>): Reagent | undefined {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (input.name !== undefined) { fields.push('name = ?'); values.push(input.name); }
    if (input.cas_number !== undefined) { fields.push('cas_number = ?'); values.push(input.cas_number); }
    if (input.category !== undefined) { fields.push('category = ?'); values.push(input.category); }
    if (input.specification !== undefined) { fields.push('specification = ?'); values.push(input.specification); }
    if (input.unit !== undefined) { fields.push('unit = ?'); values.push(input.unit); }
    if (input.stock_quantity !== undefined) { fields.push('stock_quantity = ?'); values.push(input.stock_quantity); }
    if (input.min_quantity !== undefined) { fields.push('min_quantity = ?'); values.push(input.min_quantity); }
    if (input.location !== undefined) { fields.push('location = ?'); values.push(input.location); }
    if (input.supplier !== undefined) { fields.push('supplier = ?'); values.push(input.supplier); }
    if (input.price !== undefined) { fields.push('price = ?'); values.push(input.price); }
    if (fields.length === 0) return this.findById(id);
    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(id);
    db.prepare(`UPDATE reagents SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM reagents WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static addLog(reagentId: number, userId: number, action: string, quantity: number, remark?: string): void {
    const db = getDatabase();
    db.prepare(
      'INSERT INTO reagent_logs (reagent_id, user_id, action, quantity, remark) VALUES (?, ?, ?, ?, ?)'
    ).run(reagentId, userId, action, quantity, remark || null);

    if (action === '采购入库') {
      db.prepare('UPDATE reagents SET stock_quantity = stock_quantity + ?, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?').run(quantity, reagentId);
    } else if (action === '领用出库') {
      db.prepare('UPDATE reagents SET stock_quantity = stock_quantity - ?, updated_at = datetime(\'now\', \'localtime\') WHERE id = ?').run(quantity, reagentId);
    }

    const reagent = this.findById(reagentId);
    if (reagent && reagent.stock_quantity <= reagent.min_quantity) {
      db.prepare("UPDATE reagents SET status = '库存不足', updated_at = datetime('now', 'localtime') WHERE id = ?").run(reagentId);
    } else if (reagent && reagent.stock_quantity > reagent.min_quantity) {
      db.prepare("UPDATE reagents SET status = '正常', updated_at = datetime('now', 'localtime') WHERE id = ?").run(reagentId);
    }
  }

  static getLogs(reagentId: number): ReagentLog[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reagent_logs WHERE reagent_id = ? ORDER BY created_at DESC').all(reagentId) as ReagentLog[];
  }

  static getLowStockReagents(): Reagent[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reagents WHERE stock_quantity <= min_quantity ORDER BY stock_quantity ASC').all() as Reagent[];
  }

  static count(): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COUNT(*) as count FROM reagents').get() as any;
    return row.count;
  }
}
