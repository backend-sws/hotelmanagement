export interface HousekeepingTask {
  id: number;
  business_id: number;
  room_id: number;
  booking_id: number | null;
  task_type: 'daily_cleaning' | 'deep_cleaning' | 'checkout_cleaning' | 'turndown_service' | 'maintenance_check' | 'inspect';
  assigned_user_id: number | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'issue_reported';
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  issue_description: string | null;
  images: any[] | null;
  created_at: string;
  updated_at: string;
  room?: {
    id: number;
    room_number: string;
    room_type_id: number;
    status: string;
  };
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface HousekeepingStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  issues: number;
}
