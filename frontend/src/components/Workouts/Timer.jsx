import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleTimerClick = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setTime(0);
      setIsRunning(false);
    } else {
      setIsRunning(!isRunning);
    }
    setLastTap(now);
  };

  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

  return (
    <div 
      className="flex items-center justify-center cursor-pointer" // poistettu ylimääräiset gap- ja padding-luokat
      onClick={handleTimerClick}
    >
      <span className={`text-2xl ${isRunning ? 'text-green-400' : 'text-gray-400'}`}>
        {minutes}:{seconds}
      </span>      
    </div>
  );
};

export default Timer;
