import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Agent, Trace, Message, CollaborationState } from './src/types/index.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store collaboration state
const state: CollaborationState = {
  agents: [],
  traces: [],
  messages: []
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial state to new client
  socket.emit('initialState', state);
  console.log('Sent initial state to client');

  // Handle agent joining
  socket.on('join', (agent: Agent) => {
    console.log('Agent joining:', agent);
    state.agents.push(agent);
    socket.broadcast.emit('agentJoined', agent);
    
    // Send current state to the new agent
    socket.emit('initialState', state);
  });

  // Handle agent leaving
  socket.on('leave', (agentId: string) => {
    console.log('Agent leaving:', agentId);
    state.agents = state.agents.filter(a => a.id !== agentId);
    io.emit('agentLeft', agentId);
  });

  // Handle agent movement
  socket.on('agentMove', ({ agentId, position }: { agentId: string; position: { x: number; y: number } }) => {
    const agent = state.agents.find(a => a.id === agentId);
    if (agent) {
      agent.position = position;
      socket.broadcast.emit('agentMoved', { agentId, position });
    }
  });

  // Handle new traces
  socket.on('newTrace', (trace: Trace) => {
    console.log('New trace received:', trace);
    state.traces.push(trace);
    socket.broadcast.emit('newTrace', trace);
  });

  // Handle messages
  socket.on('message', (message: Message) => {
    console.log('New message received:', message);
    state.messages.push(message);
    // Broadcast to all clients including sender for consistency
    io.emit('newMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const agent = state.agents.find(a => a.id === socket.id);
    if (agent) {
      state.agents = state.agents.filter(a => a.id !== socket.id);
      io.emit('agentLeft', socket.id);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 