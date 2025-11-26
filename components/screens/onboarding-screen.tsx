'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from '@/lib/firebase'; 

interface OnboardingScreenProps {
  user: any;
  rewardAmount: number;
  onComplete: () => void;
}

export default function OnboardingScreen({ user, rewardAmount, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [link, setLink] = useState('');
  const [error, setError] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleJoin = () => {
    setIsJoined(true);
    window.open('https://t.me/realnkhelp', '_blank');
  };

  const handleVerify = () => {
    if (!isJoined) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setTimeout(() => setStep(2), 500);
    }, 1500);
  };

  const handleLinkSubmit = () => {
    const cleanLink = link.trim();
    const isValid = cleanLink.startsWith("https://x.com/") || cleanLink.startsWith("https://twitter.com/");
    
    if (isValid && cleanLink.length > 15) {
      setError(false);
      setStep(3);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleClaim = async () => {
    try {
      const userRef = doc(db, 'users', user.id); 
      
      await updateDoc(userRef, {
        balance: increment(rewardAmount),
        isOnboarded: true,
        xProfileLink: link,
        transactions: arrayUnion({
            type: 'Welcome Bonus',
            amount: rewardAmount,
            date: new Date().toISOString()
        })
      });
      
      onComplete();
    } catch (error) {
      console.error("Error claiming reward:", error);
      onComplete(); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#05080f] text-white font-sans overflow-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .bg-glow {
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, rgba(100, 50, 255, 0.1) 50%, transparent 70%);
            filter: blur(60px);
            z-index: 1;
            pointer-events: none;
        }
        .progress-header {
            position: absolute;
            top: 20px;
            left: 0;
            width: 100%;
            padding: 0 20px;
            display: flex;
            gap: 8px;
            z-index: 20;
        }
        .progress-segment {
            flex: 1;
            height: 4px;
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 2px;
            transition: background-color 0.4s ease, box-shadow 0.4s ease;
        }
        .progress-segment.active {
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
        }
        .page-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            position: relative;
            z-index: 10;
            animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        
        h1 { font-size: 26px; font-weight: 600; margin-bottom: 15px; line-height: 1.3; }
        p { font-size: 15px; color: rgba(255, 255, 255, 0.7); line-height: 1.6; margin-bottom: 30px; max-width: 320px; }
        
        .icon-p1 { font-size: 80px; margin-bottom: 20px; display: inline-block; filter: drop-shadow(0 0 20px rgba(255,255,255,0.1)); animation: float 3s ease-in-out infinite; }
        
        .btn-action {
            background: #ffffff;
            color: #000;
            padding: 16px 25px;
            font-size: 16px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            max-width: 300px;
            margin: 10px auto;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.2s;
            box-shadow: 0 4px 15px rgba(255,255,255,0.1);
        }
        .btn-action:active { transform: scale(0.98); }
        
        .btn-verify {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(5px);
        }
        .btn-verify.enabled { background: rgba(255, 255, 255, 0.15); }
        
        .error-pill {
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 380px;
            background: linear-gradient(90deg, #ff0000, #cc0000);
            border: 1px solid #ff9999;
            color: #ffffff;
            padding: 12px 15px;
            border-radius: 50px;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            z-index: 30;
            animation: shake 0.4s ease;
        }
        
        .input-box {
            width: 100%;
            max-width: 380px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            font-size: 15px;
            outline: none;
            margin-bottom: 20px;
            transition: 0.3s;
        }
        .input-box:focus { border-color: #1d9bf0; box-shadow: 0 0 15px rgba(29, 155, 240, 0.2); }
        .btn-continue { background: linear-gradient(180deg, #4ea7ff, #1c7dff); color: white; }
        
        .coin-wrapper { margin-bottom: 30px; filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.6)); animation: float 3s ease-in-out infinite; }
        .btn-gradient {
            background: linear-gradient(90deg, #4ade80, #facc15, #f472b6, #a855f7);
            background-size: 200% 200%;
            animation: gradientMove 4s ease infinite;
            color: #1a1a1a;
            font-weight: 800;
            font-size: 18px;
        }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>

      <div className="bg-glow"></div>

      <div className="progress-header">
        <div className={`progress-segment ${step >= 1 ? 'active' : ''}`}></div>
        <div className={`progress-segment ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-segment ${step >= 3 ? 'active' : ''}`}></div>
      </div>

      {step === 1 && (
        <div className="page-container">
          <div className="icon-p1">📣</div>
          <h1>Welcome to EngagePro!</h1>
          <p>Submit your tweet, participate actively, and grow your visibility.</p>
          
          <button className="btn-action" onClick={handleJoin}>
            Join Our Community
          </button>
          
          <button 
            className={`btn-action btn-verify ${isJoined ? 'enabled' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleVerify}
            disabled={!isJoined || isVerifying}
            style={isVerified ? { background: '#28a745', color: 'white', border: 'none' } : {}}
          >
            {isVerified ? 'Verified!' : isVerifying ? 'Checking...' : 'Verify'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="page-container">
          {error && (
            <div className="error-pill">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Please enter a valid profile link starting with https://x.com/ or https://twitter.com/</span>
            </div>
          )}

          <svg width="70" height="70" viewBox="0 0 24 24" fill="white" style={{marginBottom: '30px', marginTop: '60px', filter: 'drop-shadow(0 0 15px rgba(29, 155, 240, 0.6))'}}>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>

          <h2>Welcome! Let’s<br/>get you set up.</h2>
          
          <input 
            type="text" 
            className="input-box" 
            placeholder="Paste your X profile link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={error ? {borderColor: '#ff4444'} : {}}
          />
          
          <button className="btn-action btn-continue" onClick={handleLinkSubmit}>
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="page-container">
          <div className="coin-wrapper">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" fill="url(#goldGradient)" stroke="#FCD34D" strokeWidth="2"/>
                <circle cx="50" cy="50" r="38" stroke="#B45309" strokeWidth="2" strokeOpacity="0.3"/>
                <defs>
                    <linearGradient id="goldGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FCD34D"/>
                        <stop offset="50%" stopColor="#F59E0B"/>
                        <stop offset="100%" stopColor="#D97706"/>
                    </linearGradient>
                </defs>
            </svg>
          </div>

          <h1>You've earned <span style={{color: '#FCD34D'}}>{rewardAmount}</span> Points!</h1>
          <p>Use your points to get engagement and earn even more by interacting with others.</p>

          <button className="btn-action btn-gradient" onClick={handleClaim}>
            Let’s go!
          </button>
        </div>
      )}
    </div>
  );
}