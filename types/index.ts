export interface Agent {
  id: string;
  name: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Trace {
  id: string;
  agentId: string;
  points: Array<{ x: number; y: number }>;
  color: string;
  timestamp: number;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
}

export interface CollaborationState {
  agents: Agent[];
  traces: Trace[];
  messages: Message[];
} 