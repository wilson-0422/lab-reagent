import { getDatabase } from '../config/database';
import { Instrument, CreateInstrumentInput } from '../models/instrument';
import { Reservation, CreateReservationInput } from '../models/reservation';

export class InstrumentService {
  static findAll(): Instrument[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM instruments ORDER BY created_at DESC').all() as Instrument[];
  }

  static findById(id: number): Instrument | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM instruments WHERE id = ?').get(id) as Instrument | undefined;
  }

  static create(input: CreateInstrumentInput): Instrument {
    const db = getDatabase();
    const stmt = db.prepare(
      `INSERT INTO instruments (name, model, manufacturer, serial_number, category, location, status, purchase_date, warranty_date, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(
      input.name,
      input.model || null,
      input.manufacturer || null,
      input.serial_number || null,
      input.category,
      input.location || null,
      input.status || '正常',
      input.purchase_date || null,
      input.warranty_date || null,
      input.description || null
    );
    return this.findById(result.lastInsertRowid as number)!;
  }

  static update(id: number, input: Partial<CreateInstrumentInput>): Instrument | undefined {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];
    if (input.name !== undefined) { fields.push('name = ?'); values.push(input.name); }
    if (input.model !== undefined) { fields.push('model = ?'); values.push(input.model); }
    if (input.manufacturer !== undefined) { fields.push('manufacturer = ?'); values.push(input.manufacturer); }
    if (input.serial_number !== undefined) { fields.push('serial_number = ?'); values.push(input.serial_number); }
    if (input.category !== undefined) { fields.push('category = ?'); values.push(input.category); }
    if (input.location !== undefined) { fields.push('location = ?'); values.push(input.location); }
    if (input.status !== undefined) { fields.push('status = ?'); values.push(input.status); }
    if (input.purchase_date !== undefined) { fields.push('purchase_date = ?'); values.push(input.purchase_date); }
    if (input.warranty_date !== undefined) { fields.push('warranty_date = ?'); values.push(input.warranty_date); }
    if (input.description !== undefined) { fields.push('description = ?'); values.push(input.description); }
    if (fields.length === 0) return this.findById(id);
    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(id);
    db.prepare(`UPDATE instruments SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM instruments WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static getReservations(instrumentId: number): Reservation[] {
    const db = getDatabase();
    return db.prepare(
      `SELECT r.*, u.real_name as user_name FROM reservations r
       JOIN users u ON r.user_id = u.id
       WHERE r.instrument_id = ? ORDER BY r.start_time DESC`
    ).all(instrumentId) as Reservation[];
  }

  static createReservation(input: CreateReservationInput): Reservation {
    const db = getDatabase();
    const stmt = db.prepare(
      'INSERT INTO reservations (instrument_id, user_id, start_time, end_time, purpose) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      input.instrument_id,
      input.user_id,
      input.start_time,
      input.end_time,
      input.purpose || null
    );
    return db.prepare(
      `SELECT r.*, u.real_name as user_name FROM reservations r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`
    ).get(result.lastInsertRowid) as Reservation;
  }

  static updateReservationStatus(id: number, status: string): void {
    const db = getDatabase();
    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
  }

  static checkConflict(instrumentId: number, startTime: string, endTime: string, excludeId?: number): boolean {
    const db = getDatabase();
    let query = `SELECT COUNT(*) as count FROM reservations
                 WHERE instrument_id = ? AND status != '已拒绝'
                 AND (start_time < ? AND end_time > ?)`;
    const params: any[] = [instrumentId, endTime, startTime];
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    const row = db.prepare(query).get(...params) as any;
    return row.count > 0;
  }

  static count(): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COUNT(*) as count FROM instruments').get() as any;
    return row.count;
  }

  static getReservationCount(): number {
    const db = getDatabase();
    const row = db.prepare("SELECT COUNT(*) as count FROM reservations WHERE status = '待确认'").get() as any;
    return row.count;
  }
}
