export type Condition = {
  type: "deferred";
  prerequisite: string;
};

export type TaskMessage = {
  type: "task";
  query: string;
  task_id: number;
  target?: string; // Optional: Specifies the subsystem
  priority?: number; // Optional: Lower numbers indicate higher priority
  condition?: Condition; // Optional: Conditions for deferred tasks
  status?: "pending" | "completed" | "deferred"; // Task status
};
