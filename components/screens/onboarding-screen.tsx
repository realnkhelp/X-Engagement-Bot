'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface OnboardingScreenProps {
  user: any;
  rewardAmount: number;
  onComplete: (link: string) => void;
}

export default function OnboardingScreen({ user, rewardAmount, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [link, setLink] = useState('');
  const [error, setError] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

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
    }
  };

  const handleClaim = async () => {
    if (isClaiming) return;
    setIsClaiming(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user?.id || user?.telegramId,
          twitterLink: link
        })
      });

      const data = await response.json();
      if (data.success) {
        onComplete(link);
      } else {
        alert('Something went wrong. Please try again.');
        setIsClaiming(false);
      }
    } catch (error) {
      console.error(error);
      setIsClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#05080f] text-white font-sans overflow-hidden flex flex-col items-center justify-center">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .bg-glow { position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); width: 350px; height: 350px; background: radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, rgba(100, 50, 255, 0.1) 50%, transparent 70%); filter: blur(60px); z-index: 1; pointer-events: none; }
        .progress-header { position: absolute; top: 20px; left: 0; width: 100%; padding: 0 20px; display: flex; gap: 8px; z-index: 20; }
        .progress-segment { flex: 1; height: 4px; background-color: rgba(255, 255, 255, 0.15); border-radius: 2px; transition: background-color 0.4s ease, box-shadow 0.4s ease; }
        .progress-segment.active { background-color: #ffffff; box-shadow: 0 0 10px rgba(255, 255, 255, 0.6); }
        .page-container { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; position: relative; z-index: 10; animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        
        .icon-p1 { font-size: 80px; margin-bottom: 20px; display: inline-block; filter: drop-shadow(0 0 20px rgba(255,255,255,0.1)); }
        
        .btn-action { background: #ffffff; color: #000; padding: 16px 25px; font-size: 16px; border-radius: 14px; border: none; font-weight: 700; cursor: pointer; width: 100%; max-width: 320px; margin: 8px auto; display: flex; justify-content: center; align-items: center; transition: all 0.2s; box-shadow: 0 4px 15px rgba(255,255,255,0.1); }
        .btn-action:active { transform: scale(0.98); }
        
        .btn-verify { background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); box-shadow: none; }
        .btn-verify.enabled { background: rgba(255, 255, 255, 0.15); border-color: rgba(255, 255, 255, 0.4); }
        
        .error-pill { position: absolute; top: 70px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 380px; background: #ef4444; border: 1px solid #ff7777; color: #ffffff; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4); z-index: 100; text-align: left; line-height: 1.4; transition: all 0.3s ease; }
        
        .input-box { width: 100%; max-width: 340px; padding: 18px; background: #151a24; border: 1px solid #2d3442; border-radius: 14px; color: white; font-size: 16px; outline: none; margin-bottom: 24px; transition: 0.3s; }
        .input-box:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); background: #1a202c; }
        .input-error { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15); }
        
        .btn-continue { background: #3b82f6; color: white; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); margin-top: 10px; }
        .btn-continue:hover { background: #2563eb; }
        
        .coin-wrapper { margin-bottom: 30px; filter: drop-shadow(0 0 35px rgba(255, 215, 0, 0.4)); animation: float 3s ease-in-out infinite; }
        .btn-gradient { background: linear-gradient(90deg, #4ade80, #facc15, #f472b6, #a855f7); background-size: 200% 200%; color: #1a1a1a; font-weight: 800; font-size: 18px; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3); }
      `}</style>

      <div className="bg-glow"></div>

      <div className="progress-header">
        <div className={`progress-segment ${step >= 1 ? 'active' : ''}`}></div>
        <div className={`progress-segment ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-segment ${step >= 3 ? 'active' : ''}`}></div>
      </div>

      {error && (
        <div className="error-pill animate-in slide-in-from-top-2 fade-in duration-300">
           <AlertTriangle size={20} className="shrink-0 text-white" />
           <span>Please enter a valid profile link starting with https://x.com/ or https://twitter.com/</span>
        </div>
      )}

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
            style={isVerified ? { background: '#10b981', color: 'white', borderColor: '#10b981' } : {}}
          >
            {isVerified ? 'Verified Successfully!' : isVerifying ? 'Checking...' : 'Verify'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="page-container">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="white" style={{marginBottom: '25px', marginTop: '20px', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'}}>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
          </svg>

          <h1>Welcome! Let’s<br/>get you set up.</h1>
          
          <input 
            type="text" 
            className={`input-box ${error ? 'input-error' : ''}`}
            placeholder="Paste your X profile link here"
            value={link}
            onChange={(e) => {
                setLink(e.target.value);
                if(error) setError(false);
            }}
          />
          
          <button className="btn-action btn-continue" onClick={handleLinkSubmit}>
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="page-container">
          <div className="coin-wrapper">
            <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" fill="url(#goldGradient)" stroke="#FCD34D" strokeWidth="2"/>
                <circle cx="50" cy="50" r="40" stroke="#B45309" strokeWidth="2" strokeOpacity="0.2"/>
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
          <p>Your profile is set! Start completing tasks to earn real money.</p>

          <button className="btn-action btn-gradient" onClick={handleClaim} disabled={isClaiming}>
            {isClaiming ? 'Processing...' : 'Let’s Start Engagement!'}
          </button>
        </div>
      )}
    </div>
  );
}
