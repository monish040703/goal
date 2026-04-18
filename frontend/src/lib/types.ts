export interface User {
  id: number;
  username: string;
  email: string;
  theme: string;
}

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  task_id: number;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  color: string;
  owner_id: number;
  created_at: string;
  due_date: string | null;
  subtasks: Subtask[];
  completion_percentage: number;
}

export interface BusinessGoal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  business_id: number;
  created_at: string;
}

export interface Business {
  id: number;
  title: string;
  description: string;
  industry: string;
  color: string;
  owner_id: number;
  created_at: string;
  goals: BusinessGoal[];
  completion_percentage: number;
}

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}
