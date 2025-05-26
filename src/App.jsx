import { useState, useEffect, useRef } from 'react';
import './App.css'

// Staff line Y positions (relative to SVG viewBox)
const STAFF_CENTER = 60;
const STAFF_SPACING = 16;

function AnimatedStaff({ bottom = false }) {
  // Wavy SVG path for a staff
  const staffPath =
    'M 0 60 Q 100 10, 200 60 T 400 60 T 600 60 T 800 60';
  // More distance between lines
  const lineOffsets = [-32, -16, 0, 16, 32];
  // Notes with precise vertical positions (on lines and spaces)
  const notes = [
    { symbol: '♪', start: '0%' },      // Middle line
    { symbol: '♩', start: '10%' },     // Top line
    { symbol: '♫', start: '20%' },     // Bottom line
    { symbol: '♬', start: '30%' },    // Top space
    { symbol: '♩', start: '40%' },    // Bottom space
    { symbol: '♫', start: '50%' },     // 2nd line
    { symbol: '♬', start: '60%' },     // 4th line
    { symbol: '♪', start: '70%' },    // 2nd space
    { symbol: '♩', start: '80%' },    // 3rd space
    { symbol: '♫', start: '90%' },     // Middle line
  ];
  return (
    <svg
      className={`animated-staff-bg${bottom ? ' bottom' : ''}`}
      viewBox="0 0 800 120"
      width="100%"
      height="160"
      preserveAspectRatio="none"
    >
      {/* Draw 5 staff lines */}
      {lineOffsets.map((offset, i) => (
        <path
          key={i}
          d={`M 0 ${60 + offset} Q 100 ${10 + offset}, 200 ${60 + offset} T 400 ${60 + offset} T 600 ${60 + offset} T 800 ${60 + offset}`}
          stroke="white"
          strokeOpacity="0.10"
          strokeWidth="2"
          fill="none"
        />
      ))}
      {/* Animate notes along the main path, following the path exactly */}
      {notes.map((note, i) => (
        <g key={i}>
          <text fontSize="32" fill="white" fillOpacity="0.18">
            {note.symbol}
            <animateMotion
              dur="16s"
              repeatCount="indefinite"
              keyPoints="0;1"
              keyTimes="0;1"
              path={staffPath}
              begin={`${i * 1.5}s`}
            />
          </text>
        </g>
      ))}
      {/* Hidden main path for reference */}
      <path id="mainStaffPath" d={staffPath} fill="none" />
    </svg>
  );
}

function LandingActions({ onHostClick }) {
  return (
    <div className="landing-actions">
      <div className="action-card-wrapper left">
        <div className="action-card" onClick={onHostClick} tabIndex={0} role="button">
          <span role="img" aria-label="Host">🎤</span>
          <div>Host Quiz</div>
        </div>
      </div>
      <div className="action-card-wrapper right">
        <div className="action-card">
          <span role="img" aria-label="Join">🔗</span>
          <div>Join Quiz</div>
        </div>
      </div>
    </div>
  );
}

function RoundCountSelector({ value, onChange, errorAnim }) {
  return (
    <div className={`round-count-selector${errorAnim ? ' error-anim' : ''}`}>
      <div className="round-count-label">Select Number of Rounds</div>
      <div className="round-count-scroll">
        {[3, 4, 5, 6].map((num) => (
          <button
            key={num}
            className={`round-count-btn${value === num ? ' selected' : ''}`}
            onClick={() => onChange(num)}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

const placeholderRounds = [
  {
    id: 1,
    name: 'Intro Drop',
    description:
      "The song starts and a timer begins. After a few seconds, the music mutes—but the timer keeps going! Tap when you think the singer says the first word. Closest guess wins the points. Timing is everything!"
  },
  {
    id: 2,
    name: 'Movie Match',
    description:
      'When the question begins, a song from a movie soundtrack will play for a set amount of time. Your goal: be the first to name the film the song comes from! Points go to the 1st, 2nd, and 3rd fastest players who guess correctly—so listen closely and answer fast!'
  },
  {
    id: 3,
    name: 'Tune Dash',
    description:
      'When the question starts, a random part of a song will play for a set amount of time. Be the first to guess the correct song! Points go to the 1st, 2nd, and 3rd fastest players who answer correctly.'
  },
  {
    id: 4,
    name: 'Album Gamble',
    description:
      "When a question starts, the name and cover of an album will be shown. You'll have a set amount of time to pick a song from the album. If you pick the correct song, you get points. But beware: if someone else picks the same answer as you, both of you lose your points and get zero for that question!"
  },
  {
    id: 5,
    name: 'Hit Year',
    description:
      'A #1 hit plays for a few seconds. Guess the year it topped the charts! Closest player (or players) wins the points.'
  },
  {
    id: 6,
    name: 'Cover Clash',
    description:
      'Hear a cover version of a famous song. Name the original artist for points, and get double points if you also name the song! Points go to the 1st, 2nd, and 3rd fastest correct answers.'
  },
];

function SelectRoundsPanel({ roundCount, selectedRounds, setSelectedRounds }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentRound = placeholderRounds[currentIdx];
  const isSelected = selectedRounds.some(r => r.id === currentRound.id);
  const maxSelected = selectedRounds.length >= roundCount;
  const [clicked, setClicked] = useState(false);

  function handlePrev() {
    setCurrentIdx((prev) => (prev - 1 + placeholderRounds.length) % placeholderRounds.length);
  }
  function handleNext() {
    setCurrentIdx((prev) => (prev + 1) % placeholderRounds.length);
  }
  function handleSelect() {
    if (isSelected) {
      setSelectedRounds(selectedRounds.filter(r => r.id !== currentRound.id));
    } else if (!maxSelected) {
      setSelectedRounds([...selectedRounds, currentRound]);
      setClicked(true);
      setTimeout(() => setClicked(false), 180);
    }
  }

  return (
    <div className="select-rounds-panel-2col">
      <div className="select-rounds-left">
        <div className="round-arrows-row top-arrows">
          <button className="round-arrow-btn minimal" onClick={handlePrev} aria-label="Previous Round">
            <span className="arrow-shape">&#8592;</span>
          </button>
          <button className="round-arrow-btn minimal" onClick={handleNext} aria-label="Next Round">
            <span className="arrow-shape">&#8594;</span>
          </button>
        </div>
        <div
          className={`big-round-box big${clicked ? ' clicked' : ''}${isSelected ? ' selected' : ''}${maxSelected && !isSelected ? ' disabled' : ''}`}
          onClick={handleSelect}
          tabIndex={0}
          role="button"
        >
          {currentRound.name}
          {isSelected && <span className="round-selected-check">✓</span>}
        </div>
      </div>
      <div className="select-rounds-right">
        <div className="round-desc-title right-align">Round Description</div>
        <div className="round-desc-blank">{currentRound.description}</div>
      </div>
    </div>
  );
}

function QuizBottomPanel({ openPanel, onClose, roundCount, selectedRounds, setSelectedRounds }) {
  let content = null;
  if (!openPanel) return null;
  if (openPanel === 'select') content = <SelectRoundsPanel roundCount={roundCount} selectedRounds={selectedRounds} setSelectedRounds={setSelectedRounds} />;
  return (
    <div className={`quiz-bottom-panel embedded show`}>
      <button className="panel-close-btn" onClick={onClose} title="Close">×</button>
      {content}
    </div>
  );
}

function QuizActionButtons({ openPanel, setOpenPanel, selectedRounds }) {
  function handleClick(panel) {
    if (panel === 'edit' && selectedRounds.length === 0) {
      return;
    }
    setOpenPanel(openPanel === panel ? null : panel);
  }
  return (
    <div className="quiz-action-buttons-row" style={{ justifyContent: 'center' }}>
      <button className={`quiz-action-btn${openPanel === 'select' ? ' active' : ''}`} onClick={() => handleClick('select')}>
        <span className="quiz-action-icon" role="img" aria-label="Select Rounds">🎯</span>
        Select Rounds
      </button>
    </div>
  );
}

function SelectedRoundsShowcase({ selectedRounds, setSelectedRounds }) {
  function handleUnselect(idx) {
    const round = selectedRounds[idx];
    setSelectedRounds(selectedRounds.filter(r => r.id !== round.id));
  }
  return (
    <div className="selected-rounds-showcase-outer">
      <div className="showcase-title">Game Rounds</div>
      <div className="selected-rounds-showcase-row centered">
        {selectedRounds.map((round, i) => (
          <div className="showcase-slot showcase-oblong" key={round.id} onClick={() => handleUnselect(i)} tabIndex={0} role="button">
            <div className="showcase-slot-label">Round {i + 1}</div>
            <div className="showcase-slot-name">{round.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Global tooltip component that renders outside of containers
function GlobalTooltip({ tooltip, position }) {
  if (!tooltip || !position) return null;
  
  return (
    <div 
      className="global-tooltip"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translateX(-50%)',
        visibility: 'visible',
        opacity: 1,
        width: '240px',
        background: '#181e2a',
        color: '#fff',
        textAlign: 'left',
        borderRadius: '8px',
        padding: '0.7em 1em',
        zIndex: 1000,
        boxShadow: '0 4px 16px #60efff33',
        fontSize: '0.98em',
        fontWeight: 400,
        pointerEvents: 'none',
      }}
    >
      {tooltip}
    </div>
  );
}

function SettingsPage({ onBack, selectedRounds }) {
  const [activeTab, setActiveTab] = useState('rounds'); // 'rounds' or 'game'
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  // Set default values for the first round
  const defaultSettings = {
    randomDuration: true,
    muteDuration: 10,
    points: 10,
    timeBetween: 15,
    numQuestions: 5,
  };
  const [roundSettings, setRoundSettings] = useState({ 0: { ...defaultSettings } });
  const firstRound = selectedRounds && selectedRounds.length > 0 ? selectedRounds[currentRoundIdx] : null;

  // Local state for display values of number inputs
  const [inputValues, setInputValues] = useState({ ...defaultSettings });

  // Global tooltip state
  const [globalTooltip, setGlobalTooltip] = useState({ tooltip: null, position: null });
  
  // Refs for tooltip positioning
  const iconRefs = useRef({});

  // Handle tooltip show
  const showTooltip = (key, text) => {
    const iconElement = iconRefs.current[key];
    if (iconElement) {
      const rect = iconElement.getBoundingClientRect();
      setGlobalTooltip({
        tooltip: text,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.bottom + 10
        }
      });
    }
  };

  // Handle tooltip hide
  const hideTooltip = () => {
    setGlobalTooltip({ tooltip: null, position: null });
  };

  // Sync inputValues with roundSettings when round changes
  useEffect(() => {
    const currentSettings = roundSettings[currentRoundIdx] || defaultSettings;
    setInputValues({
      muteDuration: currentSettings.muteDuration?.toString() ?? '',
      points: currentSettings.points?.toString() ?? '',
      timeBetween: currentSettings.timeBetween?.toString() ?? '',
      numQuestions: currentSettings.numQuestions?.toString() ?? '',
    });
  }, [currentRoundIdx, roundSettings]);

  const handlePrev = () => setCurrentRoundIdx(idx => Math.max(0, idx - 1));
  const handleNext = () => setCurrentRoundIdx(idx => Math.min(selectedRounds.length - 1, idx + 1));

  const handleSettingChange = (setting, value) => {
    setRoundSettings(prev => ({
      ...prev,
      [currentRoundIdx]: {
        ...prev[currentRoundIdx],
        [setting]: value
      }
    }));
  };

  // Handle input change for number fields
  const handleInputChange = (field, value) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
    if (value !== '' && !isNaN(Number(value))) {
      handleSettingChange(field, parseInt(value));
    }
  };

  // On blur, restore last valid value if input is empty or invalid
  const handleInputBlur = (field, fallbackValue) => {
    if (inputValues[field] === '' || isNaN(Number(inputValues[field]))) {
      setInputValues(prev => ({ ...prev, [field]: fallbackValue?.toString() ?? '' }));
    }
  };

  const renderRoundSettings = () => {
    if (!firstRound) return null;
    const currentSettings = roundSettings[currentRoundIdx] || {};
    if (firstRound.id === 1) {
      // Intro Drop settings
      return (
        <div className="settings-modern-group">
          <div className="settings-modern-row" style={{ position: 'relative' }}>
            <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              Random Duration
              <span className="settings-info-icon-wrapper">
                <span
                  ref={el => iconRefs.current['randomDuration'] = el}
                  className="settings-info-icon"
                  onMouseEnter={() => showTooltip('randomDuration', 'If enabled, the mute duration will be random each round.')}
                  onMouseLeave={hideTooltip}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="#60efff" strokeWidth="2.5" fill="none"/>
                    <rect x="11" y="10" width="2" height="6" rx="1" fill="#60efff"/>
                    <circle cx="12" cy="7.2" r="1.2" fill="#60efff"/>
                  </svg>
                </span>
              </span>
            </span>
            <span className="settings-modern-switch">
              <input
                type="checkbox"
                id="randomDuration"
                checked={currentSettings.randomDuration || false}
                readOnly
                tabIndex={-1}
                style={{ pointerEvents: 'none' }}
              />
              <span
                className="settings-modern-slider"
                onClick={() => handleSettingChange('randomDuration', !currentSettings.randomDuration)}
                role="checkbox"
                aria-checked={currentSettings.randomDuration || false}
                aria-label="Toggle Random Duration"
              ></span>
            </span>
          </div>
          {!currentSettings.randomDuration && (
            <div className="settings-modern-row" style={{ position: 'relative' }}>
              <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                Mute Duration
                <span className="settings-info-icon-wrapper">
                  <span
                    ref={el => iconRefs.current['muteDuration'] = el}
                    className="settings-info-icon"
                    onMouseEnter={() => showTooltip('muteDuration', 'How many seconds until the music is muted for each question.')}
                    onMouseLeave={hideTooltip}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="#60efff" strokeWidth="2.5" fill="none"/>
                      <rect x="11" y="10" width="2" height="6" rx="1" fill="#60efff"/>
                      <circle cx="12" cy="7.2" r="1.2" fill="#60efff"/>
                    </svg>
                  </span>
                </span>
              </span>
              <input
                type="number"
                min="1"
                max="30"
                className="settings-modern-input"
                id="muteDuration"
                value={inputValues.muteDuration}
                onChange={e => handleInputChange('muteDuration', e.target.value)}
                onBlur={() => handleInputBlur('muteDuration', currentSettings.muteDuration)}
                autoComplete="off"
              />
            </div>
          )}
          <div className="settings-modern-row" style={{ position: 'relative' }}>
            <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              Winners Points
              <span className="settings-info-icon-wrapper">
                <span
                  ref={el => iconRefs.current['winnersPoints'] = el}
                  className="settings-info-icon"
                  onMouseEnter={() => showTooltip('winnersPoints', 'How many points are awarded to the winner of each round.')}
                  onMouseLeave={hideTooltip}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="#60efff" strokeWidth="2.5" fill="none"/>
                    <rect x="11" y="10" width="2" height="6" rx="1" fill="#60efff"/>
                    <circle cx="12" cy="7.2" r="1.2" fill="#60efff"/>
                  </svg>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="1"
              max="20"
              className="settings-modern-input"
              id="winnersPoints"
              value={inputValues.points}
              onChange={e => handleInputChange('points', e.target.value)}
              onBlur={() => handleInputBlur('points', currentSettings.points)}
              autoComplete="off"
            />
          </div>
          <div className="settings-modern-row" style={{ position: 'relative' }}>
            <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              Break Time
              <span className="settings-info-icon-wrapper">
                <span
                  ref={el => iconRefs.current['breakTime'] = el}
                  className="settings-info-icon"
                  onMouseEnter={() => showTooltip('breakTime', 'How many seconds between each question.')}
                  onMouseLeave={hideTooltip}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="#60efff" strokeWidth="2.5" fill="none"/>
                    <rect x="11" y="10" width="2" height="6" rx="1" fill="#60efff"/>
                    <circle cx="12" cy="7.2" r="1.2" fill="#60efff"/>
                  </svg>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="5"
              max="60"
              className="settings-modern-input"
              id="breakTime"
              value={inputValues.timeBetween}
              onChange={e => handleInputChange('timeBetween', e.target.value)}
              onBlur={() => handleInputBlur('timeBetween', currentSettings.timeBetween)}
              autoComplete="off"
            />
          </div>
          <div className="settings-modern-row" style={{ position: 'relative' }}>
            <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              Questions
              <span className="settings-info-icon-wrapper">
                <span
                  ref={el => iconRefs.current['questions'] = el}
                  className="settings-info-icon"
                  onMouseEnter={() => showTooltip('questions', 'How many questions will be in this round.')}
                  onMouseLeave={hideTooltip}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="#60efff" strokeWidth="2.5" fill="none"/>
                    <rect x="11" y="10" width="2" height="6" rx="1" fill="#60efff"/>
                    <circle cx="12" cy="7.2" r="1.2" fill="#60efff"/>
                  </svg>
                </span>
              </span>
            </span>
            <input
              type="number"
              min="1"
              max="50"
              className="settings-modern-input"
              id="questions"
              value={inputValues.numQuestions}
              onChange={e => handleInputChange('numQuestions', e.target.value)}
              onBlur={() => handleInputBlur('numQuestions', currentSettings.numQuestions)}
              autoComplete="off"
            />
          </div>
        </div>
      );
    }
    // Add more round types here as needed
    return null;
  };

  return (
    <>
      <div className="quiz-creation-screen" style={{ minHeight: '100vh', overflowY: 'auto', paddingTop: 0 }}>
        <button className="back-btn" onClick={onBack} style={{ marginBottom: '0.7rem', top: 12, left: 18 }}>
          <span className="back-arrow" aria-hidden="true">&#8592;</span> Back
        </button>
        <div className="quiz-creation-center-area" style={{ flex: 1, minHeight: 0, overflow: 'visible', marginTop: 0 }}>
          <div className="settings-tabs">
            <button 
              className={`settings-tab-btn${activeTab === 'rounds' ? ' active' : ''}`}
              onClick={() => setActiveTab('rounds')}
            >
              Round Settings
            </button>
            <button 
              className={`settings-tab-btn${activeTab === 'game' ? ' active' : ''}`}
              onClick={() => setActiveTab('game')}
            >
              Game Settings
            </button>
          </div>
          <div className="settings-content">
            {activeTab === 'rounds' && (
              <div className={`round-settings active`}>
                {firstRound && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.6rem',
                  }}>
                    <button
                      onClick={handlePrev}
                      style={{
                        visibility: currentRoundIdx > 0 ? 'visible' : 'hidden',
                        background: 'none',
                        border: 'none',
                        color: '#60efff',
                        fontSize: '2rem',
                        cursor: currentRoundIdx > 0 ? 'pointer' : 'default',
                        padding: '0 0.7rem',
                        transition: 'color 0.18s, transform 0.18s',
                      }}
                      aria-label="Previous Round"
                      disabled={currentRoundIdx === 0}
                    >
                      &#8592;
                    </button>
                    <div style={{
                      color: '#00ff87',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      letterSpacing: '0.01em',
                      textShadow: '0 2px 8px #00ff8766',
                      textAlign: 'center',
                      flex: 1,
                    }}>
                      Round {currentRoundIdx + 1}: {firstRound.name}
                    </div>
                    <button
                      onClick={handleNext}
                      style={{
                        visibility: currentRoundIdx < selectedRounds.length - 1 ? 'visible' : 'hidden',
                        background: 'none',
                        border: 'none',
                        color: '#60efff',
                        fontSize: '2rem',
                        cursor: currentRoundIdx < selectedRounds.length - 1 ? 'pointer' : 'default',
                        padding: '0 0.7rem',
                        transition: 'color 0.18s, transform 0.18s',
                      }}
                      aria-label="Next Round"
                      disabled={currentRoundIdx === selectedRounds.length - 1}
                    >
                      &#8594;
                    </button>
                  </div>
                )}
                {renderRoundSettings()}
              </div>
            )}
            {activeTab === 'game' && (
              <div className={`game-settings active`}></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Save and Restore Buttons */}
      <div className="settings-action-buttons">
        <button className="settings-save-btn">
          Save Settings
        </button>
        <button className="settings-restore-btn">
          Restore Defaults
        </button>
      </div>

      {/* Global tooltip that renders outside of all containers */}
      <GlobalTooltip tooltip={globalTooltip.tooltip} position={globalTooltip.position} />
    </>
  );
}

function QuizCreationScreen({ onBack }) {
  const [roundCount, setRoundCount] = useState(3);
  const [openPanel, setOpenPanel] = useState(null);
  const [selectedRounds, setSelectedRounds] = useState([]);
  const [savedRounds, setSavedRounds] = useState([]);
  const [errorAnim, setErrorAnim] = useState(false);
  const [screen, setScreen] = useState('rounds'); // 'rounds' or 'settings'

  function handleRoundCountChange(newCount) {
    if (selectedRounds.length > newCount) {
      setErrorAnim(true);
      setTimeout(() => setErrorAnim(false), 500);
      return;
    }
    setRoundCount(newCount);
  }

  function handleNext() {
    setSavedRounds(selectedRounds);
    setScreen('settings');
  }

  function handleBackToRounds() {
    setSelectedRounds(savedRounds);
    setScreen('rounds');
  }

  // --- Settings Page ---
  if (screen === 'settings') {
    return <SettingsPage onBack={handleBackToRounds} selectedRounds={selectedRounds} />;
  }

  // --- Round Selection Screen ---
  return (
    <div className="quiz-creation-screen">
      <button className="back-btn" onClick={onBack}>
        <span className="back-arrow" aria-hidden="true">&#8592;</span> Back
      </button>
      <div className="quiz-creation-center-area">
        <RoundCountSelector value={roundCount} onChange={handleRoundCountChange} errorAnim={errorAnim} />
        <QuizActionButtons openPanel={openPanel} setOpenPanel={setOpenPanel} selectedRounds={selectedRounds} />
        {openPanel === null && (
          <SelectedRoundsShowcase selectedRounds={selectedRounds} setSelectedRounds={setSelectedRounds} />
        )}
        <QuizBottomPanel openPanel={openPanel} onClose={() => setOpenPanel(null)} roundCount={roundCount} selectedRounds={selectedRounds} setSelectedRounds={setSelectedRounds} />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button
            className="quiz-action-btn"
            style={{ minWidth: 220, fontSize: '1.2rem', opacity: selectedRounds.length === roundCount ? 1 : 0.5, cursor: selectedRounds.length === roundCount ? 'pointer' : 'not-allowed' }}
            onClick={handleNext}
            disabled={selectedRounds.length !== roundCount}
          >
            Next: Game Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('landing');

  return (
    <div className="landing-container">
      {screen === 'landing' && (
        <>
          <AnimatedStaff />
          <AnimatedStaff bottom />
          <h1 className="title">Music Quiz</h1>
          <div className="subtitle">Test your music knowledge!</div>
          <LandingActions onHostClick={() => setScreen('quiz-creation')} />
        </>
      )}
      {screen === 'quiz-creation' && <QuizCreationScreen onBack={() => setScreen('landing')} />}
    </div>
  );
}

export default App;