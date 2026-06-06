export interface Instrument {
  id: number;
  name: string;
  model: string | null;
  manufacturer: string | null;
  serial_number: string | null;
  category: string;
  location: string | null;
  status: string;
  purchase_date: string | null;
  warranty_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInstrumentInput {
  name: string;
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  category: string;
  location?: string;
  status?: string;
  purchase_date?: string;
  warranty_date?: string;
  description?: string;
}
