import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { CollaborationCanvas } from './components/CollaborationCanvas';
import { ChatPanel } from './components/ChatPanel';
import { useCollaboration } from './hooks/useCollaboration';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const JoinForm = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #E9ECEF;
  border-radius: 4px;
  outline: none;
  
  &:focus {
    border-color: #007AFF;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0056b3;
  }
`;

function App() {
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const { socket, agents, traces, messages, currentAgent, sendMessage } = useCollaboration(userName);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setIsJoined(true);
  };

  if (!isJoined) {
    return (
      <AppContainer>
        <JoinForm>
          <h2>Join Collaboration</h2>
          <form onSubmit={handleJoin}>
            <Input
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="Enter your name..."
              required
            />
            <Button type="submit">Join</Button>
          </form>
        </JoinForm>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      {socket && (
        <>
          <CollaborationCanvas
            socket={socket}
            agents={agents}
            traces={traces}
            currentAgent={currentAgent}
          />
          <ChatPanel
            messages={messages}
            agents={agents}
            currentAgent={currentAgent}
            onSendMessage={sendMessage}
          />
        </>
      )}
    </AppContainer>
  );
}

export default App;
