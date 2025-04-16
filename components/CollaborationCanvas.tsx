import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Agent, Trace } from '../types';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket;
  agents: Agent[];
  traces: Trace[];
  currentAgent: Agent;
}

const CanvasContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
`;

const AgentCursor = styled(motion.div)<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
`;

const TraceCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const CollaborationCanvas: React.FC<Props> = ({
  socket,
  agents,
  traces,
  currentAgent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTrace, setCurrentTrace] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw all traces
    traces.forEach(trace => {
      if (trace.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = trace.color;
      ctx.lineWidth = 2;
      ctx.moveTo(trace.points[0].x, trace.points[0].y);

      trace.points.forEach((point, i) => {
        if (i === 0) return;
        ctx.lineTo(point.x, point.y);
      });

      ctx.stroke();
    });
  }, [traces]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const newPoint = { x: e.clientX, y: e.clientY };
    setCurrentTrace([newPoint]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const newPoint = { x: e.clientX, y: e.clientY };
    setCurrentTrace(prev => [...prev, newPoint]);

    // Emit position to other agents
    socket.emit('agentMove', {
      agentId: currentAgent.id,
      position: newPoint,
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Emit the complete trace
    socket.emit('newTrace', {
      agentId: currentAgent.id,
      points: currentTrace,
      color: currentAgent.color,
      timestamp: Date.now(),
    });

    setCurrentTrace([]);
  };

  return (
    <CanvasContainer
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <TraceCanvas ref={canvasRef} />
      {agents.map(agent => (
        <AgentCursor
          key={agent.id}
          color={agent.color}
          animate={{
            x: agent.position.x - 10,
            y: agent.position.y - 10,
          }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
          }}
        >
          {agent.name[0]}
        </AgentCursor>
      ))}
    </CanvasContainer>
  );
}; 