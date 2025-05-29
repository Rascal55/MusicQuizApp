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
        background: 'rgba(24, 30, 42, 0.98)',
        border: '1.5px solid #60efff44',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,255,135,0.15), 0 0 0 1px rgba(96,239,255,0.1)',
        backdropFilter: 'blur(20px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
        color: '#e8f4f8',
        textAlign: 'left',
        padding: '0.7em 1em',
        zIndex: 1000,
        fontSize: '0.95em',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0.01em',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        content: '',
        position: 'absolute',
        top: '-6px',
        left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
        width: '12px',
        height: '12px',
        background: 'rgba(24, 30, 42, 0.98)',
        border: '1.5px solid #60efff44',
        borderBottom: 'none',
        borderRight: 'none',
        backdropFilter: 'blur(20px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
      }} />
      {tooltip}
    </div>
  );
}

function SettingsPage({ onBack, selectedRounds, onGameCreated }) {
  const [activeTab, setActiveTab] = useState('rounds'); // 'rounds' or 'game'
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  const handleStartGame = async () => {
    try {
      const gameConfig = {
        gameId: savedGameSettings.joinCode,
        gameSettings: savedGameSettings,
        rounds: selectedRounds.map((round, index) => ({
          roundNumber: index + 1,
          roundId: round.id,
          roundName: round.name,
          roundDescription: round.description,
          settings: savedRoundSettings[index] || {}
        }))
      };

      const createResponse = await fetch('http://localhost:3001/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameConfig)
      });

      const result = await createResponse.json();

      if (createResponse.ok) {
        // Navigate to lobby instead of showing alert
        onGameCreated({
          ...result,
          gameSettings: savedGameSettings,
          rounds: selectedRounds
        });
      } else { }

    } catch (error) { }
  };

  const checkCodeAvailable = async (code) => {
    try {
      const response = await fetch(`http://localhost:3001/api/game/${code}`);
      // If we get 404, code is available. If we get 200, code is taken.
      return response.status === 404;
    } catch (error) {
      return true; // Assume available if error (offline mode)
    }
  };
  
  // Helper function to generate random join code
  const generateUniqueJoinCode = async () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar looking chars
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop
    
    while (attempts < maxAttempts) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Check if this code is available
      const isAvailable = await checkCodeAvailable(code);
      if (isAvailable) {
        return code;
      }
      
      attempts++;
    }
    
    // Fallback: add timestamp if we can't find unique code
    const fallbackCode = 'QUIZ' + Date.now().toString().slice(-2);
    return fallbackCode;
  };

  // Default settings
  const defaultSettings = {
    randomDuration: true,
    muteDuration: 10,
    duration: 10,
    selectionTime: 30,
    earliestYear: 1980,
    points: 10,
    timeBetween: 15,
    numQuestions: 5,
  };

  // Default game settings
  const defaultGameSettings = {
    joinCode: generateUniqueJoinCode(),
    musicVolumn : 100,
    liveLeaderboard: true,
    maxPlayers: 8,
    audioOutput: 'host',
  };

  // Saved settings (persistent until page refresh/back)
  const [savedRoundSettings, setSavedRoundSettings] = useState(() => {
    const initial = {};
    selectedRounds.forEach((_, idx) => {
      initial[idx] = { ...defaultSettings };
    });
    return initial;
  });
  
  // Current working settings (temporary until saved)
  const [workingRoundSettings, setWorkingRoundSettings] = useState(() => {
    const initial = {};
    selectedRounds.forEach((_, idx) => {
      initial[idx] = { ...defaultSettings };
    });
    return initial;
  });

  // Game settings state
  const [savedGameSettings, setSavedGameSettings] = useState({ ...defaultGameSettings });
  const [workingGameSettings, setWorkingGameSettings] = useState({ ...defaultGameSettings });

  // Local display values for inputs
  const [inputValues, setInputValues] = useState({
    muteDuration: '',
    duration: '',
    selectionTime: '',
    earliestYear: '',
    points: '',
    timeBetween: '',
    numQuestions: '',
    maxPlayers: '',
  });

  // Global tooltip state
  const [globalTooltip, setGlobalTooltip] = useState({ tooltip: null, position: null });
  
  // Refs for tooltip positioning
  const iconRefs = useRef({});

  // Track if current settings have been modified
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check for unsaved changes
  useEffect(() => {
    if (activeTab === 'rounds') {
      const currentSaved = savedRoundSettings[currentRoundIdx] || defaultSettings;
      const currentWorking = workingRoundSettings[currentRoundIdx] || defaultSettings;
      const hasChanges = JSON.stringify(currentSaved) !== JSON.stringify(currentWorking);
      setHasUnsavedChanges(hasChanges);
    } else if (activeTab === 'game') {
      const hasChanges = JSON.stringify(savedGameSettings) !== JSON.stringify(workingGameSettings);
      setHasUnsavedChanges(hasChanges);
    }
  }, [workingRoundSettings, savedRoundSettings, currentRoundIdx, workingGameSettings, savedGameSettings, activeTab]);

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

  // Sync inputValues with workingRoundSettings when round changes
  useEffect(() => {
    if (activeTab === 'rounds') {
      const currentSettings = workingRoundSettings[currentRoundIdx] || defaultSettings;
      setInputValues({
        muteDuration: currentSettings.muteDuration?.toString() ?? '',
        duration: currentSettings.duration?.toString() ?? '',
        selectionTime: currentSettings.selectionTime?.toString() ?? '',
        earliestYear: currentSettings.earliestYear?.toString() ?? '',
        points: currentSettings.points?.toString() ?? '',
        timeBetween: currentSettings.timeBetween?.toString() ?? '',
        numQuestions: currentSettings.numQuestions?.toString() ?? '',
        maxPlayers: '',
      });
    } else if (activeTab === 'game') {
      setInputValues(prev => ({
        ...prev,
        maxPlayers: workingGameSettings.maxPlayers?.toString() ?? '',
      }));
    }
  }, [currentRoundIdx, workingRoundSettings, activeTab, workingGameSettings]);

  // 5. Initialize with unique code on component mount
  useEffect(() => {
    // Generate initial unique code when component mounts
    const initializeCode = async () => {
      const uniqueCode = await generateUniqueJoinCode();
      setWorkingGameSettings(prev => ({
        ...prev,
        joinCode: uniqueCode
      }));
      setSavedGameSettings(prev => ({
        ...prev,
        joinCode: uniqueCode
      }));
    };
    
    initializeCode();
  }, []); // Empty dependency array = run once on mount

  // Handle navigation with unsaved changes check
  const handleNavigation = (newRoundIdx = null, newTab = null) => {
    if (hasUnsavedChanges) {
      // Revert to saved settings
      if (activeTab === 'rounds') {
        const savedSettings = savedRoundSettings[currentRoundIdx] || defaultSettings;
        setWorkingRoundSettings(prev => ({
          ...prev,
          [currentRoundIdx]: { ...savedSettings }
        }));
      } else if (activeTab === 'game') {
        setWorkingGameSettings({ ...savedGameSettings });
      }
    }
    
    if (newRoundIdx !== null) {
      setCurrentRoundIdx(newRoundIdx);
    }
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  const handlePrev = () => {
    const newIdx = Math.max(0, currentRoundIdx - 1);
    if (newIdx !== currentRoundIdx) {
      handleNavigation(newIdx);
    }
  };

  const handleNext = () => {
    const newIdx = Math.min(selectedRounds.length - 1, currentRoundIdx + 1);
    if (newIdx !== currentRoundIdx) {
      handleNavigation(newIdx);
    }
  };

  const handleTabChange = (newTab) => {
    if (newTab !== activeTab) {
      handleNavigation(null, newTab);
    }
  };

  const handleSettingChange = (setting, value) => {
    if (activeTab === 'rounds') {
      setWorkingRoundSettings(prev => ({
        ...prev,
        [currentRoundIdx]: {
          ...prev[currentRoundIdx],
          [setting]: value
        }
      }));
    } else if (activeTab === 'game') {
      setWorkingGameSettings(prev => ({
        ...prev,
        [setting]: value
      }));
    }
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
    const currentYear = new Date().getFullYear();
    const value = parseInt(inputValues[field]);
    
    if (field === 'earliestYear') {
      if (inputValues[field] === '' || isNaN(value) || value < 1950 || value > currentYear) {
        setInputValues(prev => ({ ...prev, [field]: fallbackValue?.toString() ?? '' }));
      }
    } else {
      // For all other numeric fields, reject 0, negative values, empty, or NaN
      if (inputValues[field] === '' || isNaN(value) || value <= 0) {
        setInputValues(prev => ({ ...prev, [field]: fallbackValue?.toString() ?? '' }));
      }
    }
  };

  // Handle randomizing join code
  const handleRandomizeJoinCode = async () => {
    const newCode = await generateUniqueJoinCode();
    handleSettingChange('joinCode', newCode);
  };

  // Handle game setting change (bypasses round settings validation)
  const handleGameSettingChange = (setting, value) => {
    setWorkingGameSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Save current settings
  const handleSave = () => {
    if (activeTab === 'rounds') {
      // Check for validation errors before saving
      const currentYear = new Date().getFullYear();
      const firstRound = selectedRounds && selectedRounds.length > 0 ? selectedRounds[currentRoundIdx] : null;
      
      if (firstRound && firstRound.id === 5) { // Hit Year round
        const yearValue = parseInt(inputValues.earliestYear);
        if (isNaN(yearValue) || yearValue < 1950 || yearValue > currentYear) {
          return; // Don't save if year is invalid
        }
      }
      
      // Check all other numeric fields for positive values
      const numericFields = ['muteDuration', 'duration', 'selectionTime', 'points', 'timeBetween', 'numQuestions'];
      for (const field of numericFields) {
        if (inputValues[field] !== '') {
          const value = parseInt(inputValues[field]);
          if (isNaN(value) || value <= 0) {
            return; // Don't save if any field has invalid value
          }
        }
      }
      
      const currentSettings = workingRoundSettings[currentRoundIdx];
      setSavedRoundSettings(prev => ({
        ...prev,
        [currentRoundIdx]: { ...currentSettings }
      }));
    } else if (activeTab === 'game') {
      // Save game settings (no validation needed for join code since it's always valid)
      setSavedGameSettings({ ...workingGameSettings });
    }
    
    setHasUnsavedChanges(false);
  };

  // Restore to default settings
  const handleRestore = () => {
    if (activeTab === 'rounds') {
      setWorkingRoundSettings(prev => ({
        ...prev,
        [currentRoundIdx]: { ...defaultSettings }
      }));
      setSavedRoundSettings(prev => ({
        ...prev,
        [currentRoundIdx]: { ...defaultSettings }
      }));
    } else if (activeTab === 'game') {
      const newDefaults = { ...defaultGameSettings };
      newDefaults.joinCode = workingGameSettings.joinCode;
      newDefaults.audioOutput = 'host';
      setWorkingGameSettings(newDefaults);
      setSavedGameSettings(newDefaults);
    }
    
    setHasUnsavedChanges(false);
  };

  const renderRoundSettings = () => {
    const firstRound = selectedRounds && selectedRounds.length > 0 ? selectedRounds[currentRoundIdx] : null;
    if (!firstRound) return null;
    const currentSettings = workingRoundSettings[currentRoundIdx] || {};
    
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
                className={`settings-modern-input ${(() => {
                  const value = parseInt(inputValues.muteDuration);
                  return (isNaN(value) || value <= 0) ? 'invalid' : '';
                })()}`}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.points);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.timeBetween);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.numQuestions);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
              id="questions"
              value={inputValues.numQuestions}
              onChange={e => handleInputChange('numQuestions', e.target.value)}
              onBlur={() => handleInputBlur('numQuestions', currentSettings.numQuestions)}
              autoComplete="off"
            />
          </div>
        </div>
      );
    } else if (firstRound.id === 2) {
      // Movie Match settings
      return (
        <div className="settings-modern-group">
          <div className="settings-modern-row" style={{ position: 'relative' }}>
            <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              Duration
              <span className="settings-info-icon-wrapper">
                <span
                  ref={el => iconRefs.current['duration'] = el}
                  className="settings-info-icon"
                  onMouseEnter={() => showTooltip('duration', 'How long the song plays for each question.')}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.duration);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
              id="duration"
              value={inputValues.duration}
              onChange={e => handleInputChange('duration', e.target.value)}
              onBlur={() => handleInputBlur('duration', currentSettings.duration)}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.timeBetween);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.numQuestions);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
              id="questions"
              value={inputValues.numQuestions}
              onChange={e => handleInputChange('numQuestions', e.target.value)}
              onBlur={() => handleInputBlur('numQuestions', currentSettings.numQuestions)}
              autoComplete="off"
            />
          </div>
        </div>
      );
    } else if (firstRound.id === 3) {
      // Tune Dash settings
      return (
        <div className="settings-modern-group">
          <div className="settings-modern-row" style={{ position: 'relative' }}>
            <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              Duration
              <span className="settings-info-icon-wrapper">
                <span
                  ref={el => iconRefs.current['duration'] = el}
                  className="settings-info-icon"
                  onMouseEnter={() => showTooltip('duration', 'How long the song plays for each question.')}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.duration);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
              id="duration"
              value={inputValues.duration}
              onChange={e => handleInputChange('duration', e.target.value)}
              onBlur={() => handleInputBlur('duration', currentSettings.duration)}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.timeBetween);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
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
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.numQuestions);
                return (isNaN(value) || value <= 0) ? 'invalid' : '';
              })()}`}
              id="questions"
              value={inputValues.numQuestions}
              onChange={e => handleInputChange('numQuestions', e.target.value)}
              onBlur={() => handleInputBlur('numQuestions', currentSettings.numQuestions)}
              autoComplete="off"
            />
          </div>
        </div>
      );
    } else if (firstRound.id === 4) {
      // Album Gamble settings
      return (
        <div className="settings-modern-group">
          <div className="settings-modern-row" style={{ position: 'relative' }}>
            <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
              Selection Time
              <span className="settings-info-icon-wrapper">
                <span
                  ref={el => iconRefs.current['selectionTime'] = el}
                  className="settings-info-icon"
                  onMouseEnter={() => showTooltip('selectionTime', 'How long you have to pick a song from the album.')}
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
              min="10"
              max="120"
              className={`settings-modern-input ${(() => {
                const value = parseInt(inputValues.selectionTime);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
             id="selectionTime"
             value={inputValues.selectionTime}
             onChange={e => handleInputChange('selectionTime', e.target.value)}
             onBlur={() => handleInputBlur('selectionTime', currentSettings.selectionTime)}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.timeBetween);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.numQuestions);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
             id="questions"
             value={inputValues.numQuestions}
             onChange={e => handleInputChange('numQuestions', e.target.value)}
             onBlur={() => handleInputBlur('numQuestions', currentSettings.numQuestions)}
             autoComplete="off"
           />
         </div>
       </div>
     );
   } else if (firstRound.id === 5) {
     // Hit Year settings
     return (
       <div className="settings-modern-group">
         <div className="settings-modern-row" style={{ position: 'relative' }}>
           <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
             Earliest Year
             <span className="settings-info-icon-wrapper">
               <span
                 ref={el => iconRefs.current['earliestYear'] = el}
                 className="settings-info-icon"
                 onMouseEnter={() => showTooltip('earliestYear', 'The earliest year a #1 hit can be selected from.')}
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
             min="1950"
             max={new Date().getFullYear()}
             className={`settings-modern-input ${(() => {
               const yearValue = parseInt(inputValues.earliestYear);
               const currentYear = new Date().getFullYear();
               return (isNaN(yearValue) || yearValue < 1950 || yearValue > currentYear) ? 'invalid' : '';
             })()}`}
             id="earliestYear"
             value={inputValues.earliestYear}
             onChange={e => handleInputChange('earliestYear', e.target.value)}
             onBlur={() => handleInputBlur('earliestYear', currentSettings.earliestYear)}
             autoComplete="off"
           />
         </div>
         <div className="settings-modern-row" style={{ position: 'relative' }}>
           <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
             Duration
             <span className="settings-info-icon-wrapper">
               <span
                 ref={el => iconRefs.current['duration'] = el}
                 className="settings-info-icon"
                 onMouseEnter={() => showTooltip('duration', 'How long the song plays for each question.')}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.duration);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
             id="duration"
             value={inputValues.duration}
             onChange={e => handleInputChange('duration', e.target.value)}
             onBlur={() => handleInputBlur('duration', currentSettings.duration)}
             autoComplete="off"
           />
         </div>
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.points);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.timeBetween);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.numQuestions);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
             id="questions"
             value={inputValues.numQuestions}
             onChange={e => handleInputChange('numQuestions', e.target.value)}
             onBlur={() => handleInputBlur('numQuestions', currentSettings.numQuestions)}
             autoComplete="off"
           />
         </div>
       </div>
     );
   } else if (firstRound.id === 6) {
     // Cover Clash settings
     return (
       <div className="settings-modern-group">
         <div className="settings-modern-row" style={{ position: 'relative' }}>
           <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
             Duration
             <span className="settings-info-icon-wrapper">
               <span
                 ref={el => iconRefs.current['duration'] = el}
                 className="settings-info-icon"
                 onMouseEnter={() => showTooltip('duration', 'How long the cover song plays for each question.')}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.duration);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
             id="duration"
             value={inputValues.duration}
             onChange={e => handleInputChange('duration', e.target.value)}
             onBlur={() => handleInputBlur('duration', currentSettings.duration)}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.timeBetween);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
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
             className={`settings-modern-input ${(() => {
               const value = parseInt(inputValues.numQuestions);
               return (isNaN(value) || value <= 0) ? 'invalid' : '';
             })()}`}
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

 const firstRound = selectedRounds && selectedRounds.length > 0 ? selectedRounds[currentRoundIdx] : null;

 return (
   <>
     <div className="quiz-creation-screen" style={{ minHeight: '100vh', overflowY: 'visible', paddingTop: 0, paddingBottom: '120px' }}>
     <button className="back-btn" onClick={onBack}>
        <span className="back-arrow" aria-hidden="true">&#8592;</span> Back
      </button>
       <div className="quiz-creation-center-area" style={{ flex: 1, minHeight: 0, overflow: 'visible', marginTop: '-3.5rem' }}>
         <div className="settings-tabs">
           <button 
             className={`settings-tab-btn${activeTab === 'rounds' ? ' active' : ''}`}
             onClick={() => handleTabChange('rounds')}
           >
             Round Settings
           </button>
           <button 
             className={`settings-tab-btn${activeTab === 'game' ? ' active' : ''}`}
             onClick={() => handleTabChange('game')}
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
                     {hasUnsavedChanges && (
                       <span style={{ color: '#ff6b6b', fontSize: '0.8em', marginLeft: '0.5em' }}>
                         (Unsaved)
                       </span>
                     )}
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
             <div className={`game-settings active`}>
               <div style={{
                 color: '#00ff87',
                 fontSize: '1.5rem',
                 fontWeight: 900,
                 letterSpacing: '0.01em',
                 textShadow: '0 2px 8px #00ff8766',
                 textAlign: 'center',
                 marginBottom: '1.6rem',
               }}>
                 Game Settings
                 {hasUnsavedChanges && (
                   <span style={{ color: '#ff6b6b', fontSize: '0.8em', marginLeft: '0.5em' }}>
                     (Unsaved)
                   </span>
                 )}
               </div>
               <div className="settings-modern-group">
               <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.6rem',
                  marginTop: '-0.4rem',
                  position: 'relative',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}>
                    <div style={{
                      color: '#00ff87',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 8px rgba(0,255,135,0.4)',
                    }}>
                      Join Code:
                    </div>
                    <div style={{
                      color: '#fff',
                      fontSize: '1.4rem',
                      fontWeight: '900',
                      letterSpacing: '0.15em',
                      textShadow: '0 2px 8px rgba(0,255,135,0.2)',
                    }}>
                      {workingGameSettings.joinCode || ''}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await handleRandomizeJoinCode();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      padding: '0.3rem',
                      borderRadius: '6px',
                      marginLeft: '0.8rem',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = 'rgba(96,239,255,0.1)';
                      e.target.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="Generate new join code"
                  >
                    🎲
                  </button>
                </div>
                 <div className="settings-modern-row" style={{ position: 'relative' }}>
                  <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    Music Volume
                    <span className="settings-info-icon-wrapper">
                      <span
                        ref={el => iconRefs.current['musicVolume'] = el}
                        className="settings-info-icon"
                        onMouseEnter={() => showTooltip('musicVolume', 'Adjust the volume level for all music played during the quiz.')}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={workingGameSettings.musicVolume ?? 100}
                      onChange={e => {
                        const value = parseInt(e.target.value);
                        setWorkingGameSettings(prev => ({
                          ...prev,
                          musicVolume: value
                        }));
                      }}
                      style={{
                        width: '140px',
                        height: '6px',
                        background: `linear-gradient(to right, #60efff 0%, #60efff ${workingGameSettings.musicVolume ?? 100}%, rgba(255,255,255,0.2) ${workingGameSettings.musicVolume ?? 100}%, rgba(255,255,255,0.2) 100%)`,
                        borderRadius: '3px',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                      className="volume-slider"
                    />
                    <span style={{ 
                      color: '#60efff', 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      minWidth: '45px',
                      textAlign: 'right'
                    }}>
                      {workingGameSettings.musicVolume ?? 100}%
                    </span>
                  </div>
                </div>
                <div className="settings-modern-row" style={{ position: 'relative' }}>
                  <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    Live Leaderboard
                    <span className="settings-info-icon-wrapper">
                      <span
                        ref={el => iconRefs.current['liveLeaderboard'] = el}
                        className="settings-info-icon"
                        onMouseEnter={() => showTooltip('liveLeaderboard', 'Show the leaderboard after each round is completed.')}
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
                      id="liveLeaderboard"
                      checked={workingGameSettings.liveLeaderboard || false}
                      readOnly
                      tabIndex={-1}
                      style={{ pointerEvents: 'none' }}
                    />
                    <span
                      className="settings-modern-slider"
                      onClick={() => {
                        setWorkingGameSettings(prev => ({
                          ...prev,
                          liveLeaderboard: !prev.liveLeaderboard
                        }));
                      }}
                      role="checkbox"
                      aria-checked={workingGameSettings.liveLeaderboard || false}
                      aria-label="Toggle Live Leaderboard"
                    ></span>
                  </span>
                </div>
                <div className="settings-modern-row" style={{ position: 'relative' }}>
                  <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    Max Players
                    <span className="settings-info-icon-wrapper">
                      <span
                        ref={el => iconRefs.current['maxPlayers'] = el}
                        className="settings-info-icon"
                        onMouseEnter={() => showTooltip('maxPlayers', 'Maximum number of players allowed to join the quiz.')}
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
                    min="2"
                    max="20"
                    className={`settings-modern-input ${(() => {
                      const value = parseInt(inputValues.maxPlayers);
                      return (isNaN(value) || value <= 1) ? 'invalid' : '';
                    })()}`}
                    id="maxPlayers"
                    value={inputValues.maxPlayers}
                    onChange={e => {
                      setInputValues(prev => ({ ...prev, maxPlayers: e.target.value }));
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setWorkingGameSettings(prev => ({ ...prev, maxPlayers: value }));
                      }
                    }}
                    onBlur={() => {
                      const value = parseInt(inputValues.maxPlayers);
                      if (isNaN(value) || value <= 1) {
                        setInputValues(prev => ({ ...prev, maxPlayers: workingGameSettings.maxPlayers?.toString() || '8' }));
                      }
                    }}
                    autoComplete="off"
                  />
                </div> 
                <div className="settings-modern-row" style={{ position: 'relative' }}>
                  <span style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                    Audio Sync Mode
                    <span className="settings-info-icon-wrapper">
                      <span
                        ref={el => iconRefs.current['audioOutput'] = el}
                        className="settings-info-icon"
                        onMouseEnter={() => showTooltip('audioOutput', 'Choose where the music plays: Host device only (for in-person games), Player devices only (for remote games), or both Host and Player devices (for hybrid games).')}
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
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                    padding: '0.3rem',
                    border: '1.5px solid #60efff44'
                  }}>
                    {['host', 'players', 'both'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleGameSettingChange('audioOutput', option)}
                        style={{
                          background: workingGameSettings.audioOutput === option 
                            ? 'linear-gradient(45deg, #00ff87, #60efff)' 
                            : 'transparent',
                          color: workingGameSettings.audioOutput === option ? '#181e2a' : '#fff',
                          border: 'none',
                          borderRadius: '999px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          minWidth: '70px',
                          textAlign: 'center'
                        }}
                        onMouseEnter={e => {
                          if (workingGameSettings.audioOutput !== option) {
                            e.target.style.background = 'rgba(96,239,255,0.1)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (workingGameSettings.audioOutput !== option) {
                            e.target.style.background = 'transparent';
                          }
                        }}
                      >
                        {option === 'host' ? '🎧 Host' : 
                        option === 'players' ? '📱 Players' : 
                        '🔊 Both'}
                      </button>
                    ))}
                  </div>
                </div>     
               </div>
               <div style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '1.2rem',
                  marginBottom: '-1.2rem'
                }}>
                  <button
                    className="settings-save-btn"  // Use the SAME class as Save Settings button
                    onClick={handleStartGame}
                    disabled={hasUnsavedChanges}
                    style={{
                      background: hasUnsavedChanges 
                        ? 'rgba(255, 107, 107, 0.3)' 
                        : 'linear-gradient(135deg, #00ff87 0%, #60efff 50%, #ff6b9d 100%)',
                      color: hasUnsavedChanges ? '#ff6b6b' : '#fff',
                      border: hasUnsavedChanges ? '2px solid #ff6b6b' : 'none',
                      opacity: hasUnsavedChanges ? 0.6 : 1,
                      cursor: hasUnsavedChanges ? 'not-allowed' : 'pointer',
                      boxShadow: hasUnsavedChanges 
                        ? '0 4px 16px rgba(255, 107, 107, 0.2)' 
                        : '0 4px 16px rgba(0,255,135,0.2)',
                      padding: '1.1rem 2.2rem',
                      fontSize: '1.15rem'
                    }}
                  >
                    {hasUnsavedChanges ? '⚠️ Save Settings First' : '🚀 Start Game'}
                  </button>
                </div>
             </div>
           )}
         </div>
       </div>
     </div>
     
     {/* Save and Restore Buttons */}
     <div className="settings-action-buttons">
       <button 
         className="settings-save-btn"
         onClick={handleSave}
         disabled={!hasUnsavedChanges}
         style={{
           opacity: hasUnsavedChanges ? 1 : 0.5,
           cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed'
         }}
       >
         Save Settings
       </button>
       <button className="settings-restore-btn" onClick={handleRestore}>
         Restore Defaults
       </button>
     </div>
     
     {/* Global tooltip that renders outside of all containers */}
     <GlobalTooltip tooltip={globalTooltip.tooltip} position={globalTooltip.position} />
   </>
 );
}

function GameLobby({ gameData, onBack, onStartGame }) {
  const [players, setPlayers] = useState([]);
  const [gameStatus, setGameStatus] = useState('lobby');

  return (
    <div className="quiz-creation-screen" style={{ overflowY: 'visible' }}>
      <button className="back-btn" onClick={onBack}>
        <span className="back-arrow" aria-hidden="true">&#8592;</span> Cancel Game
      </button>

      <div className="quiz-creation-center-area" style={{ paddingTop: '0' }}>
        
        {/* Join Code Display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          paddingTop: '0.25rem',
          marginTop: '-3.75rem'
        }}>
          <div style={{
            fontSize: '3.5rem',
            color: '#00ff87',
            fontWeight: '700',
            marginBottom: '0rem',
            textShadow: '0 2px 8px rgba(0,255,135,0.4)'
          }}>
            Game Ready!
          </div>
          
          <div style={{
            fontSize: '1.2rem',
            color: '#a0a0a0',
            marginBottom: '0.2rem'
          }}>
            Players can join with this code:
          </div>
          
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#fff',
            letterSpacing: '0.6rem',
            textShadow: '0 4px 16px rgba(0,255,135,0.3)',
            textAlign: 'center',
          }}>
            {gameData.joinCode}
          </div>
        </div>

        {/* Player List Section */}
        <div style={{
          background: 'rgba(24, 30, 42, 0.95)',
          borderRadius: '24px',
          padding: '1rem 2.5rem',
          minWidth: '750px',
          maxWidth: '750px',
          margin: '-1rem auto 0.125rem auto',
          border: '1.5px solid #60efff22',
          boxShadow: '0 8px 32px rgba(0,255,135,0.10)',
          minHeight: '350px'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#60efff',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Players ({players.length}/{gameData.gameSettings.maxPlayers})
          </div>

          {players.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#a0a0a0',
              fontSize: '1.3rem',
              padding: '4rem 2rem',
              fontStyle: 'italic'
            }}>
              Waiting for players to join...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {players.map((player, index) => (
                <div key={player.id} style={{
                  background: 'rgba(0,255,135,0.1)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #60efff33',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.5rem'
                  }}>
                    {player.name}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: '#a0a0a0'
                  }}>
                    Player {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          <button
            onClick={onStartGame}
            disabled={players.length < 2}
            style={{
              background: players.length >= 2 
                ? 'linear-gradient(135deg, #00ff87 0%, #60efff 50%, #ff6b9d 100%)'
                : 'rgba(160, 160, 160, 0.3)',
              color: players.length >= 2 ? '#fff' : '#666',
              border: 'none',
              borderRadius: '12px',
              padding: '1.2rem 2.5rem',
              fontSize: '1.3rem',
              fontWeight: '700',
              cursor: players.length >= 2 ? 'pointer' : 'not-allowed',
              opacity: players.length >= 2 ? 1 : 0.5,
              boxShadow: players.length >= 2 
                ? '0 4px 16px rgba(0,255,135,0.2)'
                : '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            🚀 Start Game ({players.length >= 2 ? 'Ready!' : `Need ${2 - players.length} more`})
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizCreationScreen({ onBack, onGameCreated }) {
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
    return <SettingsPage onBack={handleBackToRounds} selectedRounds={selectedRounds} onGameCreated={onGameCreated}/>;
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
  const [gameData, setGameData] = useState(null); // Store game session data

  // Handle successful game creation
  const handleGameCreated = (gameSession) => {
    setGameData(gameSession);
    setScreen('lobby');
  };

  // Handle going back from lobby
  const handleBackFromLobby = async () => {
    try {
      // Clean up the game on the server
      if (gameData && gameData.joinCode) {
        
        const response = await fetch(`http://localhost:3001/api/game/${gameData.joinCode}`, {
          method: 'DELETE'
        });
      }
    } catch (error) { }
    
    // Reset state and go back to landing page
    setGameData(null);
    setScreen('landing');
  };

  // Handle starting the actual game
  const handleStartGame = async () => {
    setScreen('playing');
  };

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
      
      {screen === 'quiz-creation' && (
        <QuizCreationScreen 
          onBack={() => setScreen('landing')}
          onGameCreated={handleGameCreated} // Pass the callback
        />
      )}
      
      {screen === 'lobby' && gameData && (
        <GameLobby 
          gameData={gameData}
          onBack={handleBackFromLobby}
          onStartGame={handleStartGame}
        />
      )}
      
      {screen === 'playing' && (
        <div style={{ 
          color: 'white', 
          fontSize: '2rem', 
          textAlign: 'center', 
          padding: '4rem' 
        }}>
          🎮 Game Screen Coming Soon!
        </div>
      )}
    </div>
  );
}

export default App;