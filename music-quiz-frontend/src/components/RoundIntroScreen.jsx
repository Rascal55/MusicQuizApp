import { useState, useEffect } from 'react';

function RoundIntroScreen({ 
  isHost, 
  roundData, 
  socket, 
  onRoundStart 
}) {
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleRoundStarted = () => {
      console.log('🎮 Round starting...');
      onRoundStart();
    };

    socket.on('roundStarted', handleRoundStarted);

    return () => {
      socket.off('roundStarted', handleRoundStarted);
    };
  }, [socket, onRoundStart]);

  const handleStartRound = () => {
    if (!socket || isStarting) return;
    
    setIsStarting(true);
    console.log('🚀 Host starting round...');
    socket.emit('startRound');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Animation Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(96,239,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '20%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      {/* Host Start Button - Top Right */}
      {isHost && (
        <button
          onClick={handleStartRound}
          disabled={isStarting}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '700',
            background: isStarting 
              ? 'rgba(160, 160, 160, 0.3)' 
              : 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
            color: isStarting ? '#666' : '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: isStarting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isStarting 
              ? 'none' 
              : '0 4px 15px rgba(0,255,135,0.3)',
            zIndex: 10
          }}
        >
          {isStarting ? '🚀 Starting...' : '▶️ Start Round'}
        </button>
      )}

      {/* Main Content */}
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        width: '100%'
      }}>
        {/* Round Number */}
        <div style={{
          fontSize: '1.5rem',
          color: '#60efff',
          fontWeight: '600',
          marginBottom: '1rem',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Round {roundData?.roundNumber || 1}
        </div>

        {/* Round Name */}
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #60efff 0%, #00ff87 50%, #ff6b9d 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 2rem 0',
          lineHeight: '1.1',
          textShadow: '0 4px 20px rgba(96,239,255,0.3)'
        }}>
          {roundData?.roundName || 'Quick Fire'}
        </h1>

        {/* Round Description */}
        <div style={{
          fontSize: '1.4rem',
          color: '#e0e0e0',
          lineHeight: '1.6',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem auto'
        }}>
          {roundData?.description || 'Answer as many questions as you can in this fast-paced round!'}
        </div>



        {/* Waiting Message for Players */}
        {!isHost && (
          <div style={{
            padding: '1.5rem 2rem',
            background: 'rgba(96, 239, 255, 0.1)',
            border: '1px solid rgba(96, 239, 255, 0.3)',
            borderRadius: '16px',
            color: '#60efff',
            fontSize: '1.2rem',
            fontWeight: '600',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            🎯 Waiting for host to start the round...
          </div>
        )}
      </div>

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default RoundIntroScreen;