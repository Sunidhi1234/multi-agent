import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Message, Agent } from '../types';

interface Props {
  messages: Message[];
  agents: Agent[];
  currentAgent: Agent;
  onSendMessage: (content: string) => void;
}

const ChatContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 300px;
  height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled.div<{ isOwnMessage: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: ${props => props.isOwnMessage ? '#007AFF' : '#E9ECEF'};
  color: ${props => props.isOwnMessage ? 'white' : 'black'};
  align-self: ${props => props.isOwnMessage ? 'flex-end' : 'flex-start'};
  word-break: break-word;
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #E9ECEF;
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #E9ECEF;
  border-radius: 4px;
  outline: none;
  
  &:focus {
    border-color: #007AFF;
  }
`;

const SendButton = styled.button`
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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const MessageTime = styled.span`
  font-size: 0.7em;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
`;

export const ChatPanel: React.FC<Props> = ({
  messages,
  agents,
  currentAgent,
  onSendMessage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  const getAgentName = (agentId: string) => {
    if (agentId === currentAgent.id) return 'You';
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Unknown Agent';
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            isOwnMessage={message.agentId === currentAgent.id}
          >
            <div style={{ fontSize: '0.8em', marginBottom: '4px' }}>
              {getAgentName(message.agentId)}
            </div>
            {message.content}
            <MessageTime>{formatTime(message.timestamp)}</MessageTime>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type a message..."
            autoFocus
          />
          <SendButton type="submit" disabled={!inputValue.trim()}>
            Send
          </SendButton>
        </InputContainer>
      </form>
    </ChatContainer>
  );
}; 