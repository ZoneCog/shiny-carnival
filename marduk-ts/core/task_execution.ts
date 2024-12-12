import { TaskMessage, Condition } from "../types/task_types.ts";

export function executeTasks(taskQueue: TaskMessage[], memoryState: { completedTopics: string[] }): void {
  taskQueue.forEach((task) => {
    if (task.condition && !checkCondition(task.condition, memoryState)) {
      console.log(`Task deferred: ${task.query}`);
    } else {
      console.log(`Executing task: ${task.query}`);
      // Simulate task execution
      console.log(`Task completed: ${task.query}`);
    }
  });
}

function checkCondition(condition: Condition, memoryState: { completedTopics: string[] }): boolean {
  if (condition.type === "deferred") {
    return memoryState.completedTopics.includes(condition.prerequisite);
  }
  return true;
}
