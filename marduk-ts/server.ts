import { ResponseMessage, TaskMessage } from "../types/messages.ts";

const ws = new WebSocket("ws://localhost:8080");

const logFile = "./logs/marduk_log.json";

const tasks: TaskMessage[] = [
  { type: "task", query: "Retrieve facts about chaos theory", task_id: 1 },
  { type: "task", query: "Retrieve recent events", task_id: 2 },
  { type: "task", query: "Provide workflows for bug resolution", task_id: 3 },
  { type: "task", query: "Find relationships between Chaos Theory and Nonlinear Equations", task_id: 4 },
];

let currentTaskIndex = 0;

ws.onopen = () => {
  console.log("Marduk Core connected to WebSocket server");
  scheduleNextTask();
};

ws.onmessage = (event) => {
  const message: ResponseMessage = JSON.parse(event.data);

  if (message.type === "response") {
    console.log(`Response from ${message.subsystem}:`, message.result);
    logResponse(message);
    scheduleNextTask();
  }
};

function scheduleNextTask() {
  if (currentTaskIndex < tasks.length) {
    const task = tasks[currentTaskIndex];
    ws.send(JSON.stringify(task));
    currentTaskIndex++;
    console.log(`Task scheduled: ${task.query}`);
  } else {
    console.log("All tasks have been scheduled and completed.");
  }
}

async function logResponse(response: ResponseMessage) {
  try {
    let logs = [];
    try {
      const existingLogs = await Deno.readTextFile(logFile);
      logs = JSON.parse(existingLogs);
    } catch {
      console.log("No existing log file. Creating a new one.");
    }

    logs.push({ timestamp: new Date().toISOString(), response });
    await Deno.writeTextFile(logFile, JSON.stringify(logs, null, 2));
    console.log("Response logged successfully.");
  } catch (error) {
    console.error("Error logging response:", error);
  }
}
