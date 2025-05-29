import { useState, useRef } from 'react';

function PlayerJoinScreen({ onJoinGame, onBack }) {
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [step, setStep] = useState(1); // 1: Enter code, 2: Enter name
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleCodeSubmit = async () => {
    if (joinCode.length !== 6) return;

    setIsLoading(true);
    setError('');

    try {
      // Validate game exists
      const response = await fetch(`http://localhost:3001/api/game/${joinCode.toUpperCase()}`);
      
      if (response.ok) {
        const gameInfo = await response.json();
        console.log('✅ Game found:', gameInfo);
        setStep(2); // Move to name entry
      } else {
        setError('Game not found! Check your code and try again.');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error validating game:', error);
    }

    setIsLoading(false);
  };

  const handleNameSubmit = async () => {
    if (!playerName.trim()) return;

    setIsLoading(true);
    
    // Call parent function to join the game
    await onJoinGame({
      joinCode: joinCode.toUpperCase(),
      playerName: playerName.trim()
    });
    
    setIsLoading(false);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleBoxClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="quiz-creation-screen">
      <button className="back-btn" onClick={onBack}>
        <span className="back-arrow" aria-hidden="true">&#8592;</span> Back
      </button>

      <div className="quiz-creation-center-area">
        {step === 1 ? (
          // Step 1: Enter Join Code
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <div style={{
                fontSize: '3.5rem',
                color: '#60efff',
                fontWeight: '700',
                marginBottom: '0.5rem',
                textShadow: '0 2px 8px rgba(96,239,255,0.4)'
              }}>
                Join Game
              </div>
              
              <div style={{
                fontSize: '1.2rem',
                color: '#a0a0a0'
              }}>
                Enter the game code to join
              </div>
            </div>

            <div style={{
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <div style={{
                marginBottom: '2rem'
              }}>
                {/* Code input display with underscores */}
                <div 
                  onClick={handleBoxClick}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    letterSpacing: '1rem',
                    background: 'rgba(24, 30, 42, 0.95)',
                    border: `2px solid ${isFocused ? '#60efff' : '#60efff33'}`,
                    borderRadius: '16px',
                    color: '#fff',
                    cursor: 'text',
                    fontFamily: 'monospace',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s ease'
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <span key={index} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '3rem',
                      height: '3rem',
                      marginRight: index < 5 ? '0.5rem' : '0',
                      position: 'relative'
                    }}>
                      {/* Character display */}
                      <span style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: joinCode[index] ? '#fff' : 'transparent',
                        position: 'absolute',
                        top: '50%',
                        left: '0.75rem',
                        right: '0',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        textAlign: 'center'
                      }}>
                        {joinCode[index] || '_'}
                      </span>
                      
                      {/* Bottom line */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2.5rem',
                        height: '3px',
                        background: joinCode[index] ? '#00ff87' : '#60efff33',
                        transition: 'background 0.3s ease'
                      }} />
                      
                      {/* Cursor */}
                      {isFocused && index === joinCode.length && joinCode.length < 6 && (
                        <span style={{
                          position: 'absolute',
                          top: '45%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '2px',
                          height: '2.5rem',
                          background: '#60efff',
                          animation: 'blink 1s infinite',
                          zIndex: 3
                        }} />
                      )}
                    </span>
                  ))}
                </div>
                
                {/* Hidden actual input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                  onKeyPress={(e) => handleKeyPress(e, handleCodeSubmit)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  maxLength={6}
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    opacity: 0,
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(255, 107, 157, 0.1)',
                  border: '1px solid rgba(255, 107, 157, 0.3)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '2rem',
                  color: '#ff6b9d',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleCodeSubmit}
                disabled={joinCode.length !== 6 || isLoading}
                style={{
                  width: '100%',
                  padding: '1.2rem 2rem',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  background: joinCode.length === 6 && !isLoading
                    ? 'linear-gradient(135deg, #60efff 0%, #00ff87 100%)'
                    : 'rgba(160, 160, 160, 0.3)',
                  color: joinCode.length === 6 && !isLoading ? '#fff' : '#666',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: joinCode.length === 6 && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: joinCode.length === 6 && !isLoading ? 1 : 0.5
                }}
              >
                {isLoading ? '🔍 Checking...' : '🎮 Find Game'}
              </button>
            </div>
          </>
        ) : (
          // Step 2: Enter Player Name
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <div style={{
                fontSize: '3.5rem',
                color: '#00ff87',
                fontWeight: '700',
                marginBottom: '0.5rem',
                textShadow: '0 2px 8px rgba(0,255,135,0.4)'
              }}>
                Game Found!
              </div>
              
              <div style={{
                fontSize: '1.4rem',
                color: '#60efff',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                Code: {joinCode}
              </div>
              
              <div style={{
                fontSize: '1.2rem',
                color: '#a0a0a0'
              }}>
                Enter your name to join the lobby
              </div>
            </div>

            <div style={{
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <div style={{
                marginBottom: '2rem'
              }}>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleNameSubmit)}
                  placeholder="Your Name"
                  maxLength={20}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    background: 'rgba(24, 30, 42, 0.95)',
                    border: '2px solid #60efff33',
                    borderRadius: '16px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                onClick={handleNameSubmit}
                disabled={!playerName.trim() || isLoading}
                style={{
                  width: '100%',
                  padding: '1.2rem 2rem',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  background: playerName.trim() && !isLoading
                    ? 'linear-gradient(135deg, #00ff87 0%, #60efff 50%, #ff6b9d 100%)'
                    : 'rgba(160, 160, 160, 0.3)',
                  color: playerName.trim() && !isLoading ? '#fff' : '#666',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: playerName.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? '🎵 Joining...' : '🚀 Join Lobby'}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default PlayerJoinScreen;