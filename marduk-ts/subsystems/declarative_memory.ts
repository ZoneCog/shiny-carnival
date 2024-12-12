import { TaskMessage, ResponseMessage } from "../types/messages.ts";

const ws = new WebSocket("ws://localhost:8080");

const declarativeFacts = [
  { id: 1, fact: "Chaos theory studies the behavior of dynamical systems that are highly sensitive to initial conditions." },
  { id: 2, fact: "Nonlinear equations are foundational to understanding dynamic systems." },
  { id: 3, fact: "Procedural workflows are critical for resolving complex software bugs." },
];

ws.onopen = () => {
  console.log("Declarative Memory connected to WebSocket server");
  ws.send(JSON.stringify({ type: "register", subsystem: "declarative_memory" }));
};

ws.onmessage = (event) => {
  const message: TaskMessage = JSON.parse(event.data);
  if (message.type === "task" && message.query.includes("fact")) {
    const matchingFacts = queryFacts(message.query);
    const response: ResponseMessage = {
      type: "response",
      subsystem: "declarative_memory",
      task_id: message.task_id,
      result: matchingFacts,
    };
    ws.send(JSON.stringify(response));
  }
};

function queryFacts(query: string): string[] {
  return declarativeFacts
    .filter((fact) => fact.fact.toLowerCase().includes(query.toLowerCase()))
    .map((fact) => fact.fact);
}
