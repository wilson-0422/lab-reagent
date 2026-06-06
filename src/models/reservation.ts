export interface Reservation {
  id: number;
  instrument_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  purpose: string | null;
  status: string;
  created_at: string;
}

export interface CreateReservationInput {
  instrument_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  purpose?: string;
}
