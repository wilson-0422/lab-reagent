export interface HazardChemical {
  id: number;
  name: string;
  cas_number: string | null;
  hazard_class: string;
  un_number: string | null;
  risk_phrase: string | null;
  safety_phrase: string | null;
  storage_condition: string | null;
  stock_quantity: number;
  location: string | null;
  supervisor: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface HazardLog {
  id: number;
  hazard_id: number;
  user_id: number;
  action: string;
  quantity: number;
  remark: string | null;
  created_at: string;
}

export interface CreateHazardInput {
  name: string;
  cas_number?: string;
  hazard_class: string;
  un_number?: string;
  risk_phrase?: string;
  safety_phrase?: string;
  storage_condition?: string;
  stock_quantity?: number;
  location?: string;
  supervisor?: string;
}
