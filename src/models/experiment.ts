export interface Experiment {
  id: number;
  title: string;
  user_id: number;
  category: string;
  description: string | null;
  procedure: string | null;
  result: string | null;
  conclusion: string | null;
  attachments: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExperimentInput {
  title: string;
  user_id: number;
  category: string;
  description?: string;
  procedure?: string;
  result?: string;
  conclusion?: string;
  status?: string;
}
