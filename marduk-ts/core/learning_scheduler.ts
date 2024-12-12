import { Insight, TaskMessage } from "../types/task_types.ts";

export function _generateGoals(insights: Insight[]): TaskMessage[] {
  const newTasks: TaskMessage[] = [];

  insights.forEach((insight) => {
    if (insight.type === "error") {
      newTasks.push({
        type: "task",
        query: `Investigate error ${insight.errorCode} related to ${insight.context}`,
        task_id: Date.now(),
        target: "semantic_memory",
      });

      if (insight.requiresResearch) {
        newTasks.push({
          type: "task",
          query: `Study ${insight.field} with focus on ${insight.topic}`,
          task_id: Date.now() + 1,
          target: "declarative_memory",
          condition: {
            type: "deferred",
            prerequisite: `research-completed:${insight.topic}`,
          },
        });
      }
    }

    if (insight.type === "success" && insight.unlockedPaths) {
      insight.unlockedPaths.forEach((path: string) => {
        newTasks.push({
          type: "task",
          query: `Complete ${path} as follow-up to ${insight.task}`,
          task_id: Date.now(),
          target: "procedural_memory",
        });
      });
    }
  });

  return newTasks;
}

// Example usage for testing
if (import.meta.main) {
  const insights: Insight[] = [
    { type: "error", errorCode: "E123", context: "Process A", requiresResearch: true, field: "Physics", topic: "Quantum Dynamics" },
    { type: "success", task: "Task B", unlockedPaths: ["Task C", "Task D"] },
  ];

  const tasks = _generateGoals(insights);
  console.log("Generated tasks:", tasks);
}
