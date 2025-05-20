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

function App() {
  return (
    <div className="landing-container">
      <AnimatedStaff />
      <AnimatedStaff bottom />
      <h1 className="title">Music Quiz</h1>
      <div className="subtitle">Test your music knowledge!</div>
    </div>
  );
}

export default App;
