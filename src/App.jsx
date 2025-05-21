import { useState, useRef, useEffect } from 'react';
import './App.css'

// Staff line Y positions (relative to SVG viewBox)
const STAFF_CENTER = 60;
const STAFF_SPACING = 16;
const STAFF_LINES = [
  STAFF_CENTER - 2 * STAFF_SPACING, // Top line
  STAFF_CENTER - 1 * STAFF_SPACING, // 2nd line
  STAFF_CENTER,                     // Middle line
  STAFF_CENTER + 1 * STAFF_SPACING, // 4th line
  STAFF_CENTER + 2 * STAFF_SPACING, // Bottom line
];
const STAFF_SPACES = [
  STAFF_CENTER - 1.5 * STAFF_SPACING, // Top space
  STAFF_CENTER - 0.5 * STAFF_SPACING, // 2nd space
  STAFF_CENTER + 0.5 * STAFF_SPACING, // 3rd space
  STAFF_CENTER + 1.5 * STAFF_SPACING, // Bottom space
];

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

function RoundCountSelector({ value, onChange, selectedRounds, errorAnim }) {
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
  { id: 1, name: 'Round A', description: 'Description for Round A.' },
  { id: 2, name: 'Round B', description: 'Description for Round B.' },
  { id: 3, name: 'Round C', description: 'Description for Round C.' },
  { id: 4, name: 'Round D', description: 'Description for Round D.' },
  { id: 5, name: 'Round E', description: 'Description for Round E.' },
  { id: 6, name: 'Round F', description: 'Description for Round F.' },
  { id: 7, name: 'Round G', description: 'Description for Round G.' },
];

function RoundsList({ rounds, selected, onToggle, max, onInfo }) {
  return (
    <div className="rounds-list-vertical">
      {rounds.map((round) => {
        const isSelected = selected.some(r => r.id === round.id);
        return (
          <div
            key={round.id}
            className={`round-list-card${isSelected ? ' selected' : ''}${selected.length >= max && !isSelected ? ' disabled' : ''}`}
            onClick={() => onToggle(round)}
          >
            <div className="round-info" onClick={e => { e.stopPropagation(); onInfo(round); }}>
              <span className="info-icon">i</span>
            </div>
            <div className="round-card-name">{round.name}</div>
          </div>
        );
      })}
    </div>
  );
}

function SelectedRoundsPills({ selected }) {
  if (selected.length === 0) return null;
  return (
    <div className="selected-rounds-pills-row">
      {selected.map((round, idx) => (
        <div className="selected-round-pill" key={round.id}>
          <span className="pill-index">{idx + 1}</span> {round.name}
        </div>
      ))}
    </div>
  );
}

function RoundInfoModal({ round, onClose }) {
  if (!round) return null;
  return (
    <div className="round-info-modal-bg" onClick={onClose}>
      <div className="round-info-modal" onClick={e => e.stopPropagation()}>
        <h3>{round.name}</h3>
        <p>{round.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function SelectRoundsPanel({ roundCount, selectedRounds, setSelectedRounds }) {
  const dummyRounds = [
    { id: 1, name: 'Round A', description: '' },
    { id: 2, name: 'Round B', description: '' },
    { id: 3, name: 'Round C', description: '' },
    { id: 4, name: 'Round D', description: '' },
    { id: 5, name: 'Round E', description: '' },
    { id: 6, name: 'Round F', description: '' },
    { id: 7, name: 'Round G', description: '' },
  ];
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentRound = dummyRounds[currentIdx];
  const isSelected = selectedRounds.some(r => r.id === currentRound.id);
  const maxSelected = selectedRounds.length >= roundCount;
  const [clicked, setClicked] = useState(false);

  function handlePrev() {
    setCurrentIdx((prev) => (prev - 1 + dummyRounds.length) % dummyRounds.length);
  }
  function handleNext() {
    setCurrentIdx((prev) => (prev + 1) % dummyRounds.length);
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
  if (!openPanel) return null;
  let content = null;
  if (openPanel === 'select') content = <SelectRoundsPanel roundCount={roundCount} selectedRounds={selectedRounds} setSelectedRounds={setSelectedRounds} />;
  if (openPanel === 'edit') content = <div className="panel-content">Edit Rounds Panel</div>;
  if (openPanel === 'settings') content = <div className="panel-content">Game Settings Panel</div>;
  return (
    <div className={`quiz-bottom-panel embedded show`}>
      <button className="panel-close-btn" onClick={onClose} title="Close">×</button>
      {content}
    </div>
  );
}

function QuizActionButtons({ openPanel, setOpenPanel }) {
  function handleClick(panel) {
    setOpenPanel(openPanel === panel ? null : panel);
  }
  return (
    <div className="quiz-action-buttons-row">
      <button className={`quiz-action-btn${openPanel === 'select' ? ' active' : ''}`} onClick={() => handleClick('select')}>
        <span className="quiz-action-icon" role="img" aria-label="Select Rounds">🎯</span>
        Select Rounds
      </button>
      <button className={`quiz-action-btn${openPanel === 'edit' ? ' active' : ''}`} onClick={() => handleClick('edit')}>
        <span className="quiz-action-icon" role="img" aria-label="Edit Rounds">✏️</span>
        Edit Rounds
      </button>
      <button className={`quiz-action-btn${openPanel === 'settings' ? ' active' : ''}`} onClick={() => handleClick('settings')}>
        <span className="quiz-action-icon" role="img" aria-label="Game Settings">⚙️</span>
        Game Settings
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

function QuizCreationScreen({ onBack }) {
  const [roundCount, setRoundCount] = useState(3);
  const [openPanel, setOpenPanel] = useState(null);
  const [selectedRounds, setSelectedRounds] = useState([]);
  const [errorAnim, setErrorAnim] = useState(false);

  function handleRoundCountChange(newCount) {
    if (selectedRounds.length > newCount) {
      setErrorAnim(true);
      setTimeout(() => setErrorAnim(false), 500);
      return;
    }
    setRoundCount(newCount);
  }

  return (
    <div className="quiz-creation-screen">
      <button className="back-btn" onClick={onBack}>
        <span className="back-arrow" aria-hidden="true">&#8592;</span> Back
      </button>
      <div className="quiz-creation-center-area">
        <RoundCountSelector value={roundCount} onChange={handleRoundCountChange} selectedRounds={selectedRounds} errorAnim={errorAnim} />
        <QuizActionButtons openPanel={openPanel} setOpenPanel={setOpenPanel} />
        {openPanel === null && (
          <SelectedRoundsShowcase selectedRounds={selectedRounds} setSelectedRounds={setSelectedRounds} />
        )}
        <QuizBottomPanel openPanel={openPanel} onClose={() => setOpenPanel(null)} roundCount={roundCount} selectedRounds={selectedRounds} setSelectedRounds={setSelectedRounds} />
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
