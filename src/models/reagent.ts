export interface Reagent {
  id: number;
  name: string;
  cas_number: string | null;
  category: string;
  specification: string | null;
  unit: string;
  stock_quantity: number;
  min_quantity: number;
  location: string | null;
  supplier: string | null;
  price: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ReagentLog {
  id: number;
  reagent_id: number;
  user_id: number;
  action: string;
  quantity: number;
  remark: string | null;
  created_at: string;
}

export interface CreateReagentInput {
  name: string;
  cas_number?: string;
  category: string;
  specification?: string;
  unit: string;
  stock_quantity?: number;
  min_quantity?: number;
  location?: string;
  supplier?: string;
  price?: number;
}
