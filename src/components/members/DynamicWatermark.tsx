// ==============================================================================
// MARTMARKET ANTI-PIRACY DYNAMIC WATERMARK ENGINE
// Overlays dynamic, pulsating, moving text (User Name, Email, IP hash, Timestamp)
// onto video frames to disincentivize unauthorized screen capture and piracy.
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface DynamicWatermarkProps {
  studentName?: string;
  studentEmail?: string;
  studentIp?: string;
}

export const DynamicWatermark: React.FC<DynamicWatermarkProps> = ({
  studentName = 'Kelson Manuel',
  studentEmail = 'kelson.dev@martmarket.com',
  studentIp = '102.214.88.19 (Luanda, AO)'
}) => {
  const [position, setPosition] = useState({ top: 15, left: 15 });
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // Subtle repositioning every 10 seconds across 6 safe quadrants
    const moveInterval = setInterval(() => {
      const positions = [
        { top: 12, left: 12 },
        { top: 12, left: 60 },
        { top: 45, left: 25 },
        { top: 45, left: 65 },
        { top: 75, left: 15 },
        { top: 75, left: 55 }
      ];
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setPosition(randomPos);
      setTimestamp(new Date().toLocaleTimeString());
    }, 10000);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none select-none z-20 transition-all duration-1000 ease-in-out opacity-25 hover:opacity-40"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
      }}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/40 backdrop-blur-[2px] border border-white/10 text-[10px] font-mono text-slate-300 shadow-sm tracking-wider">
        <Shield className="w-3 h-3 text-blue-400 opacity-60" />
        <span>{studentName} • {studentEmail} • {studentIp} • {timestamp}</span>
      </div>
    </div>
  );
};
