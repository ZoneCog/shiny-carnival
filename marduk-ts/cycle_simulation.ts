import { TaskManager } from "./tasks/task_manager.ts";
import { DeferredTaskHandler } from "./tasks/deferred_task_handler.ts";
import { TaskMessage } from "./types/task_types.ts";
import { retrievePreviousNotes, saveNotesToSelf } from "./core/notes_manager.ts";
import { deliberate } from "./core/deliberation.ts";
import { executeTasks } from "./core/task_execution.ts";

// Initialize managers
const taskManager = new TaskManager();
const deferredTaskHandler = new DeferredTaskHandler();

// Simulate a full cycle
async function runCycle() {
  console.log("=== Start of Cycle ===");

  // Step 1: Retrieve insights from previous cycle
  const previousNotes = await retrievePreviousNotes();
  console.log("Previous Notes:", previousNotes);

  // Step 2: Deliberate and generate tasks
  const newTasks = deliberate(previousNotes);
  newTasks.forEach((task) => {
    if (task.condition) {
      deferredTaskHandler.addDeferredTask(task);
    } else {
      taskManager.addTask(task);
    }
  });

  // Step 3: Simulate memory state and activate deferred tasks
  const memoryState = { completedTopics: ["research-completed:Quantum Dynamics"] }; // Example memory state
  const activatedTasks = deferredTaskHandler.activateTasks(memoryState);
  activatedTasks.forEach((task) => taskManager.addTask(task));

  // Step 4: Prioritize tasks
  const prioritizedTasks = taskManager.prioritizeTasks();
  console.log("Prioritized Tasks:", prioritizedTasks);

  // Step 5: Execute tasks
  executeTasks(prioritizedTasks, memoryState);

  // Step 6: Review results and save notes for the next cycle
  const taskResults = prioritizedTasks.map((task) => ({
    status: task.status || "completed",
    query: task.query,
    context: task.target,
  }));
  const notes = taskResults.map((result) => `Task: ${result.query} - Status: ${result.status}`);
  await saveNotesToSelf(notes);

  console.log("=== End of Cycle ===");
}

// Run the full cycle simulation
await runCycle();
