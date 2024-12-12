# marduk-ts
Marduk TS

---

Here’s the **updated directory structure** for the repository, including the new components for **deliberation cycles**, **memory integration**, **task handling**, and **notes management**.

---

### **Updated Directory Structure**

```plaintext
marduk-ts/
├── core/
│   ├── marduk_core.ts             # Main orchestrator for Marduk's cycles
│   ├── deliberation.ts            # Handles divergent/convergent goal synthesis
│   ├── task_execution.ts          # Manages task execution and deferred tasks
│   ├── notes_manager.ts           # Saves/retrieves notes for inter-cycle learning
│   ├── learning_scheduler.ts      # Generates learning tasks and adaptive schedules
├── subsystems/
│   ├── declarative_memory.ts      # Handles facts, definitions, and frameworks
│   ├── episodic_memory.ts         # Stores and retrieves narrative/contextual events
│   ├── procedural_memory.ts       # Manages workflows and step-by-step guides
│   ├── semantic_memory.ts         # Manages relationships between concepts
├── tasks/
│   ├── task_manager.ts            # Handles task prioritization and updates
│   ├── deferred_task_handler.ts   # Manages deferred tasks and conditions
├── logs/
│   ├── notes2self.json            # Stores notes from previous cycles
│   ├── task_log.json              # Logs task execution results
│   ├── error_log.json             # Logs errors and unresolved issues
├── tests/
│   ├── declarative_memory_test.ts # Unit tests for Declarative Memory
│   ├── episodic_memory_test.ts    # Unit tests for Episodic Memory
│   ├── procedural_memory_test.ts  # Unit tests for Procedural Memory
│   ├── semantic_memory_test.ts    # Unit tests for Semantic Memory
│   ├── marduk_core_test.ts        # Unit tests for Marduk Core and cycles
│   ├── deliberation_test.ts       # Unit tests for deliberation and goal synthesis
│   ├── task_execution_test.ts     # Unit tests for task execution
│   ├── notes_manager_test.ts      # Unit tests for notes retrieval and saving
├── types/
│   ├── messages.ts                # Shared types for messages (e.g., TaskMessage, ResponseMessage)
│   ├── task_types.ts              # Types for tasks, conditions, and priorities
├── workflows/
│   ├── backup-marduk.ts           # Workflow to back up the marduk-ts directory
│   ├── ci-and-backup.yml          # Main CI workflow with linting, tests, and backups
```

---

### **Explanation of Key Additions**

#### **1. Core**
- **`deliberation.ts`**: Implements the divergent and convergent goal synthesis process, integrating insights from memory systems.
- **`task_execution.ts`**: Manages task execution and deferred task handling.
- **`notes_manager.ts`**: Handles saving and retrieving `notes2self` for inter-cycle learning.
- **`learning_scheduler.ts`**: Dynamically generates learning tasks and schedules based on knowledge gaps.

#### **2. Subsystems**
- No structural changes, but integrates with the deliberation process by providing insights and managing updates from the task manager.

#### **3. Tasks**
- **`task_manager.ts`**: Centralizes task prioritization, updates, and integration into workflows.
- **`deferred_task_handler.ts`**: Handles tasks with conditions and reactivates them when prerequisites are met.

#### **4. Logs**
- **`notes2self.json`**: Stores structured notes from each cycle for retrieval in subsequent cycles.
- **`task_log.json`**: Logs the results of task execution for analysis.
- **`error_log.json`**: Tracks errors and unresolved issues for future research or debugging.

#### **5. Tests**
- Expanded unit tests for:
  - Deliberation and goal synthesis (`deliberation_test.ts`).
  - Task execution and deferred task handling (`task_execution_test.ts`).
  - Notes management (`notes_manager_test.ts`).

#### **6. Types**
- **`task_types.ts`**:
  - Defines types for tasks, conditions, and priorities to improve type safety and consistency.

---

### **Example Use Case: Cycle Flow**

#### **Start Cycle**
- **Marduk Core**:
  - Loads notes from `notes2self.json` using `notes_manager.ts`.
  - Triangulates insights from memory subsystems.
  - Synthesizes goals using `deliberation.ts`.

#### **Task Updates**
- **Task Manager**:
  - Prioritizes and integrates new tasks.
  - Adds deferred tasks to the queue if conditions aren’t met.

#### **Execution**
- **Task Execution**:
  - Executes tasks for the current cycle using `task_execution.ts`.
  - Logs results to `task_log.json`.

#### **Review and Notes**
- **Notes Manager**:
  - Analyzes results and saves structured notes to `notes2self.json`.

---

### **Next Steps**

1. Implement the new modules (`deliberation.ts`, `notes_manager.ts`, etc.).
2. Add corresponding unit tests.
3. Integrate the cycle flow into **Marduk Core**.
4. Test the full workflow in a development environment.

Let me know if you’d like detailed implementation examples for specific modules! 😊

---

Using **TypeScript** with **Deno** for implementing the **Marduk framework** offers strong typing, enhanced developer experience, and seamless runtime integration. Below are the steps tailored for **Deno** using TypeScript.

---

## **Steps to Set Up the Framework in TypeScript with Deno**

### **1. Install and Set Up Deno**

1. Install Deno:
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```
2. Verify installation:
   ```bash
   deno --version
   ```

---

### **2. Create the Project Directory Structure**

```plaintext
marduk-ts/
├── server.ts                  # WebSocket server
├── core/
│   └── marduk_core.ts         # Marduk Core
├── subsystems/
│   ├── declarative_memory.ts  # Declarative Memory Subsystem
│   ├── episodic_memory.ts     # Episodic Memory Subsystem
│   ├── procedural_memory.ts   # Procedural Memory Subsystem
│   ├── semantic_memory.ts     # Semantic Memory Subsystem
├── types/
│   └── messages.ts            # Shared types for communication
└── logs/
    └── marduk_log.json        # Log file for Marduk Core
```

---

### **3. Implement the WebSocket Server**

The server facilitates communication between subsystems and Marduk Core.

#### **Code: `server.ts`**
```typescript
import { serve } from "https://deno.land/std@0.118.0/http/server.ts";

const clients = new Set<WebSocket>();

async function websocketHandler(request: Request): Promise<Response> {
  if (request.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(request);
    clients.add(socket);

    socket.onmessage = (event) => {
      console.log("Received:", event.data);
      // Broadcast the message to all other clients
      for (const client of clients) {
        if (client !== socket) client.send(event.data);
      }
    };

    socket.onclose = () => {
      clients.delete(socket);
      console.log("Client disconnected");
    };

    return response;
  }

  return new Response("WebSocket server running");
}

console.log("Server running on http://localhost:8080");
await serve(websocketHandler, { port: 8080 });
```

---

### **4. Define Shared Types**

Create reusable types for communication between components.

#### **Code: `types/messages.ts`**
```typescript
export interface TaskMessage {
  type: "task";
  query: string;
  task_id: number;
  target?: string;
}

export interface ResponseMessage {
  type: "response";
  subsystem: string;
  task_id: number;
  result: any;
}

export type Message = TaskMessage | ResponseMessage;
```

---

### **5. Implement a Subsystem**

Each subsystem connects to the server, processes tasks, and sends responses.

#### **Code: `subsystems/declarative_memory.ts`**
```typescript
import { Message, TaskMessage, ResponseMessage } from "../types/messages.ts";

const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Declarative Memory connected to WebSocket server");
  ws.send(JSON.stringify({ type: "register", subsystem: "declarative_memory" }));
};

ws.onmessage = (event) => {
  const message: Message = JSON.parse(event.data);

  if (message.type === "task" && message.query.includes("fact")) {
    const response: ResponseMessage = {
      type: "response",
      subsystem: "declarative_memory",
      task_id: message.task_id,
      result: ["Fact 1", "Fact 2"],
    };
    ws.send(JSON.stringify(response));
  }
};
```

---

### **6. Implement Marduk Core**

The core orchestrates tasks and integrates responses.

#### **Code: `core/marduk_core.ts`**
```typescript
import { Message, TaskMessage, ResponseMessage } from "../types/messages.ts";

const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Marduk Core connected to WebSocket server");
};

ws.onmessage = (event) => {
  const message: Message = JSON.parse(event.data);

  if (message.type === "response") {
    console.log(`Response from ${message.subsystem}:`, message.result);
    logResponse(message);
  }
};

function broadcastTask(query: string, task_id: number) {
  const task: TaskMessage = { type: "task", query, task_id };
  ws.send(JSON.stringify(task));
}

function logResponse(response: ResponseMessage) {
  const logFile = "./logs/marduk_log.json";
  const logs = JSON.parse(Deno.readTextFileSync(logFile) || "[]");
  logs.push({ timestamp: new Date().toISOString(), ...response });
  Deno.writeTextFileSync(logFile, JSON.stringify(logs, null, 2));
}

// Example: Broadcast a task after 5 seconds
setTimeout(() => {
  broadcastTask("Retrieve facts about chaos theory", 1);
}, 5000);
```

---

### **7. Add More Subsystems**

Implement similar scripts for other subsystems like Episodic Memory, Procedural Memory, and Semantic Memory by adapting their task-handling logic.

---

### **8. Run the Framework**

1. Start the WebSocket server:
   ```bash
   deno run --allow-net server.ts
   ```

2. Start Marduk Core:
   ```bash
   deno run --allow-net --allow-read --allow-write core/marduk_core.ts
   ```

3. Start Declarative Memory:
   ```bash
   deno run --allow-net subsystems/declarative_memory.ts
   ```

---

### **9. Automate Task Cycles**
Enhance **Marduk Core** with scheduling.

**Code: Task Scheduler in `core/marduk_core.ts`**
```typescript
const tasks: TaskMessage[] = [
  { type: "task", query: "Retrieve facts about chaos theory", task_id: 1 },
  { type: "task", query: "Narrate recent events on project X", task_id: 2 },
];

let currentTaskIndex = 0;

setInterval(() => {
  if (currentTaskIndex < tasks.length) {
    ws.send(JSON.stringify(tasks[currentTaskIndex]));
    currentTaskIndex++;
  }
}, 10000); // Schedule tasks every 10 seconds
```

---

### **10. Advanced Features**

#### **A. Persistent Memory**
Use `Deno KV` for persistent storage instead of JSON files.

#### **B. Error Handling**
Add retries and error handling for failed tasks.

#### **C. Feedback Loops**
Allow Marduk Core to dynamically adjust task queries based on subsystem responses.

---

### **Summary of Commands**

1. **Run WebSocket Server**:
   ```bash
   deno run --allow-net server.ts
   ```

2. **Run Subsystems**:
   ```bash
   deno run --allow-net subsystems/declarative_memory.ts
   ```

3. **Run Marduk Core**:
   ```bash
   deno run --allow-net --allow-read --allow-write core/marduk_core.ts
   ```

This setup in **TypeScript with Deno** ensures type safety, real-time interaction, and modular extensibility for the Marduk framework. Let me know if you'd like further refinements!

---

Here is a **GitHub Action workflow** to automate the initialization of the repository. This workflow will set up the necessary files and dependencies for your **Marduk framework** in a **TypeScript and Deno** environment.

---

### **Workflow File: `.github/workflows/repo-initialization.yml`**

```yaml
name: Initialize Marduk Framework Repo

on:
  workflow_dispatch: # Allows manual triggering
  push:               # Runs on every push to the repository
    branches:
      - main

jobs:
  initialize-repo:
    runs-on: ubuntu-latest

    steps:
    # Step 1: Checkout the Repository
    - name: Checkout Repository
      uses: actions/checkout@v3

    # Step 2: Set Up Deno
    - name: Set Up Deno
      uses: denoland/setup-deno@v2
      with:
        deno-version: v1.x

    # Step 3: Create Directory Structure
    - name: Create Directory Structure
      run: |
        mkdir -p marduk-ts/core
        mkdir -p marduk-ts/subsystems
        mkdir -p marduk-ts/types
        mkdir -p marduk-ts/logs

    # Step 4: Add Initial Files
    - name: Add Initial Files
      run: |
        echo 'import { serve } from "https://deno.land/std@0.118.0/http/server.ts";' > marduk-ts/server.ts
        echo 'export interface TaskMessage {...}' > marduk-ts/types/messages.ts
        echo '{}' > marduk-ts/logs/marduk_log.json
        echo '// Core implementation' > marduk-ts/core/marduk_core.ts
        echo '// Declarative memory implementation' > marduk-ts/subsystems/declarative_memory.ts

    # Step 5: Commit Changes
    - name: Commit Changes
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git add .
        git commit -m "Initial setup of Marduk framework files and structure"
        git push

    # Step 6: Verify Deno Installation
    - name: Verify Deno
      run: deno --version
```

---

### **Explanation**

1. **Triggering the Workflow**:
   - The workflow runs when:
     - Pushed to the `main` branch.
     - Manually triggered from the **GitHub Actions** tab using `workflow_dispatch`.

2. **Set Up Deno**:
   - Uses the [denoland/setup-deno](https://github.com/denoland/setup-deno) action to install the latest stable version of Deno.

3. **Create Directory Structure**:
   - Sets up directories for `core`, `subsystems`, `types`, and `logs`.

4. **Add Initial Files**:
   - Adds basic TypeScript templates to each key directory.
   - Initializes an empty `marduk_log.json` in the `logs/` folder.

5. **Commit Changes**:
   - Configures Git and commits the initialized structure to the repository.

6. **Verify Deno Installation**:
   - Ensures that Deno is correctly installed and available.

---

### **How to Use This Workflow**

1. **Add the Workflow File**:
   - Save the workflow file as `.github/workflows/repo-initialization.yml`.

2. **Manually Trigger the Workflow**:
   - Go to the **Actions** tab in your GitHub repository.
   - Select the `Initialize Marduk Framework Repo` workflow and click **Run workflow**.

3. **Check the Repo**:
   - Verify that the directories and files have been created in the repository.

---

### **Next Steps**

Once initialized:
1. Start adding the actual implementation for the WebSocket server, Marduk Core, and subsystems in the created files.
2. Extend the workflow to include **automated tests**, **linting**, or **deployment steps** if needed.

This workflow gives you a solid starting point for the Marduk framework while leveraging automation for consistent repo initialization.
