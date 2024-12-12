import { Insight, TaskMessage } from "../types/task_types.ts";
import { _generateGoals } from "./learning_scheduler.ts";

export function deliberate(previousNotes: string[]): TaskMessage[] {
  const insights = gatherMemoryInsights(previousNotes);
  const newGoals = _generateGoals(insights);

  console.log("Generated Goals:", newGoals);
  return newGoals;
}

function gatherMemoryInsights(notes: string[]): Insight[] {
  return [
    { type: "error", errorCode: "E123", context: "Process A", requiresResearch: true, field: "Physics", topic: "Quantum Dynamics" },
    { type: "success", task: "Task B", unlockedPaths: ["Task C", "Task D"] },
    ...notes.map((note) => ({ type: "reflection", content: note })),
  ];
}
