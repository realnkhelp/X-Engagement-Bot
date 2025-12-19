'use client';

import { useState, useEffect } from 'react';

interface MaintenanceScreenProps {
  maintenanceDate: string;
  maintenanceMessage: string;
  isDark: boolean;
}

const formatNumber = (num: number) => String(num).padStart(2, '0');

export default function MaintenanceScreen({ maintenanceDate, maintenanceMessage, isDark }: MaintenanceScreenProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const maintenanceEnd = new Date(maintenanceDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = maintenanceEnd - now;

      if (distance < 0) {
        setIsFinished(true);
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(countdownInterval);
  }, [maintenanceDate]);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-5 bg-[#34495e] transition-colors`}>
      <style jsx global>{`
        .maintenance-container {
            background-color: #2c3e50; 
            padding: 40px 30px; 
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            max-width: 90%; 
            width: 400px; 
            border: 1px solid rgba(255,255,255,0.1); 
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .icon {
            color: #63b5e4; 
            font-size: 60px;
            margin-bottom: 20px;
            display: inline-block;
        }
        .title {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            white-space: nowrap;
            letter-spacing: 1px;
        }
        .description {
            color: #bdc3c7;
            font-size: 15px;
            margin-bottom: 25px;
            line-height: 1.5;
            width: 100%;
        }
        .completion-label {
            color: #f39c12; 
            font-weight: bold; 
            font-size: 14px;
            margin-bottom: 15px;
            text-align: center;
            width: 100%;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .countdown {
            display: flex;
            justify-content: center; 
            gap: 12px; 
            width: 100%;
        }
        .countdown-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #34495e; 
            padding: 10px 5px;
            border-radius: 6px;
            min-width: 60px; 
            border-bottom: 3px solid #f39c12; 
        }
        .countdown-number {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            line-height: 1;
        }
        .countdown-label {
            font-size: 11px;
            color: #bdc3c7;
            text-transform: uppercase; 
            margin-top: 5px;
        }
      `}</style>

      <div className="maintenance-container">
        
        <span className="icon">
          {isFinished ? '✅' : '⚙️'}
        </span> 

        <h1 className="title">
          {isFinished ? 'SYSTEM ONLINE' : 'SYSTEM MAINTENANCE'}
        </h1>

        <p className="description">
          {maintenanceMessage || 'We are currently performing scheduled maintenance.'}
        </p>
        
        {!isFinished ? (
          <>
            <p className="completion-label">
              Expected Completion Time
            </p>
            
            <div className="countdown">
              <div className="countdown-item">
                <span className="countdown-number">{formatNumber(timeLeft.days)}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{formatNumber(timeLeft.hours)}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{formatNumber(timeLeft.minutes)}</span>
                <span className="countdown-label">Min</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{formatNumber(timeLeft.seconds)}</span>
                <span className="countdown-label">Sec</span>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 text-lg font-bold text-[#2ecc71]">Please refresh the page.</div>
        )}
      </div>
    </div>
  );
}
