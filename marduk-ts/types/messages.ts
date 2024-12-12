export interface BaseMessage {
  type: "register" | "task" | "response";
}

export interface RegisterMessage extends BaseMessage {
  type: "register";
  subsystem: string;
}

export interface TaskMessage extends BaseMessage {
  type: "task";
  query: string;
  task_id: number;
  target?: string;
}

export interface ResponseMessage extends BaseMessage {
  type: "response";
  subsystem: string;
  task_id: number;
  result: unknown;
}

export type Message = RegisterMessage | TaskMessage | ResponseMessage;
