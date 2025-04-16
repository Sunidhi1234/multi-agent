import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { Agent, Trace, Message, CollaborationState } from '../types';

const SOCKET_SERVER_URL = 'http://localhost:3001';

export const useCollaboration = (userName: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAgent, setCurrentAgent] = useState<Agent>(() => ({
    id: uuidv4(),
    name: userName,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    position: { x: 0, y: 0 },
  }));

  // Update currentAgent when userName changes
  useEffect(() => {
    setCurrentAgent(prev => ({
      ...prev,
      name: userName
    }));
  }, [userName]);

  useEffect(() => {
    if (!userName) return;

    console.log('Connecting to socket server...');
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Join the collaboration
    newSocket.emit('join', currentAgent);
    console.log('Emitted join event with agent:', currentAgent);

    // Listen for updates
    newSocket.on('agentJoined', (agent: Agent) => {
      console.log('Agent joined:', agent);
      setAgents(prev => [...prev, agent]);
    });

    newSocket.on('agentLeft', (agentId: string) => {
      console.log('Agent left:', agentId);
      setAgents(prev => prev.filter(a => a.id !== agentId));
    });

    newSocket.on('agentMoved', ({ agentId, position }: { agentId: string; position: { x: number; y: number } }) => {
      setAgents(prev =>
        prev.map(agent =>
          agent.id === agentId
            ? { ...agent, position }
            : agent
        )
      );
    });

    newSocket.on('newTrace', (trace: Trace) => {
      console.log('New trace received:', trace);
      setTraces(prev => [...prev, trace]);
    });

    newSocket.on('newMessage', (message: Message) => {
      console.log('New message received:', message);
      // Only add the message if it's not already in the list
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    newSocket.on('initialState', (state: CollaborationState) => {
      console.log('Received initial state:', state);
      setAgents(state.agents);
      setTraces(state.traces);
      setMessages(state.messages);
    });

    return () => {
      console.log('Disconnecting socket...');
      newSocket.emit('leave', currentAgent.id);
      newSocket.disconnect();
    };
  }, [userName]);

  const sendMessage = (content: string) => {
    if (!socket || !content.trim()) return;

    const message: Message = {
      id: uuidv4(),
      agentId: currentAgent.id,
      content: content.trim(),
      timestamp: Date.now(),
    };

    console.log('Sending message:', message);
    socket.emit('message', message);
    // Remove optimistic update - we'll get the message back from the server
  };

  return {
    socket,
    agents,
    traces,
    messages,
    currentAgent,
    sendMessage,
  };
}; 