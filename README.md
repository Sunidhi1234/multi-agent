# Real-Time Multi-Agent Collaboration with Traces

A real-time collaborative workspace where multiple agents can interact, draw traces, and communicate with each other. Built for Hackathon 2025.

## Features

- Real-time multi-agent collaboration
- Visual traces and drawing capabilities
- Live agent position tracking
- Integrated chat system
- Smooth animations and transitions
- Modern, responsive UI

## Technologies Used

- React with TypeScript
- Socket.IO for real-time communication
- Emotion for styled components
- Framer Motion for animations
- Express.js backend

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server and client:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

- Each agent is represented by a colored cursor on the canvas
- Draw traces by clicking and dragging on the canvas
- See other agents' movements and traces in real-time
- Communicate with other agents using the chat panel
- All actions are synchronized across all connected clients

## Architecture

- Frontend: React application with TypeScript
- Backend: Express.js server with Socket.IO
- Real-time state management using Socket.IO events
- Styled components for consistent UI
- Framer Motion for smooth animations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project for your own purposes.
