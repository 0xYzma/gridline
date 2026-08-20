import React, { useRef, useEffect } from 'react';
import type { Circuit, CarState } from '../../types';
import { mockCircuit, tireColors } from '../../data/mockData';

interface CircuitVisualizerProps {
  circuit?: Circuit;
  carStates: CarState[];
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({ 
  circuit = mockCircuit, 
  carStates 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track
    const trackMap = circuit.trackMap;
    if (trackMap.length < 2) return;

    // Scale and center the track
    const padding = 40;
    const maxX = Math.max(...trackMap.map(p => p.x));
    const maxY = Math.max(...trackMap.map(p => p.y));
    const scaleX = (canvas.width - padding * 2) / maxX;
    const scaleY = (canvas.height - padding * 2) / maxY;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (canvas.width - maxX * scale) / 2;
    const offsetY = (canvas.height - maxY * scale) / 2;

    // Draw track surface
    ctx.beginPath();
    ctx.moveTo(trackMap[0].x * scale + offsetX, trackMap[0].y * scale + offsetY);
    
    for (let i = 1; i < trackMap.length; i++) {
      ctx.lineTo(trackMap[i].x * scale + offsetX, trackMap[i].y * scale + offsetY);
    }
    
    ctx.closePath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw track line
    ctx.beginPath();
    ctx.moveTo(trackMap[0].x * scale + offsetX, trackMap[0].y * scale + offsetY);
    
    for (let i = 1; i < trackMap.length; i++) {
      ctx.lineTo(trackMap[i].x * scale + offsetX, trackMap[i].y * scale + offsetY);
    }
    
    ctx.closePath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw start/finish line
    const startPos = trackMap[0];
    ctx.beginPath();
    ctx.moveTo(startPos.x * scale + offsetX - 10, startPos.y * scale + offsetY);
    ctx.lineTo(startPos.x * scale + offsetX + 10, startPos.y * scale + offsetY);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw cars on track
    carStates.forEach((car) => {
      if (car.inPit || car.isOut) return;

      // Calculate position along track based on lap progress
      const totalPoints = trackMap.length - 1;
      const positionIndex = (car.position - 1) % totalPoints;
      const nextIndex = (positionIndex + 1) % totalPoints;
      
      const p1 = trackMap[positionIndex];
      const p2 = trackMap[nextIndex];
      
      // Interpolate between points
      const t = (car.position % 1) || 0.5;
      const x = (p1.x + (p2.x - p1.x) * t) * scale + offsetX;
      const y = (p1.y + (p2.y - p1.y) * t) * scale + offsetY;

      // Draw car dot
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = tireColors[car.tire.compound];
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw driver number
      ctx.fillStyle = '#fff';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(car.driverId, x, y - 10);
    });

    // Draw circuit info
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(circuit.name, padding, padding);
    ctx.font = '12px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText(`${circuit.length}m • ${circuit.turns} turns`, padding, padding + 18);

  }, [circuit, carStates]);

  return (
    <div className="bg-gridline-dark rounded-lg overflow-hidden border border-gray-800">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={700}
        className="w-full h-auto"
      />
    </div>
  );
};

export default CircuitVisualizer;
