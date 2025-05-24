import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const labelClass = 'setting-label';
const rowClass = 'setting-row';
const inputWrapperClass = 'setting-input-wrapper';
const inputClass = 'setting-input';
const unitClass = 'setting-unit';
const toggleClass = 'setting-toggle';
const checkboxClass = 'setting-checkbox';

const infoDescriptions = {
  randomDuration: 'If enabled, the intro duration will be random for each question.',
  introDuration: 'How many seconds of the intro will play before guessing starts.',
  winningPoints: 'Points for a win.',
  timeBetweenQuestions: 'How many seconds between each question.',
  numberOfQuestions: 'How many questions will be in this round.'
};

const defaultSettings = {
  randomDuration: true,
  introDuration: 5,
  winningPoints: 10,
  timeBetweenQuestions: 10,
  numberOfQuestions: 10
};

// Shared open popover index for all InfoPopover instances
function useSharedPopover() {
  const [openIndex, setOpenIndex] = useState(null);
  return [openIndex, setOpenIndex];
}

function InfoPopover({ text, index, openIndex, setOpenIndex }) {
  const iconRef = useRef();
  const [popoverPos, setPopoverPos] = useState(null);

  // Show popover only when hovering/focusing the icon
  const showPopover = openIndex === index && popoverPos;

  useEffect(() => {
    if (openIndex === index && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPopoverPos({
        left: rect.left + rect.width / 2,
        top: rect.bottom + window.scrollY + 8 // 8px below the icon
      });
    } else if (openIndex !== index) {
      setPopoverPos(null);
    }
  }, [openIndex, index]);

  // Clean up popover on scroll/resize
  useEffect(() => {
    if (!showPopover) return;
    const close = () => setOpenIndex(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close, true);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close, true);
    };
  }, [showPopover, setOpenIndex]);

  return (
    <>
      <span
        className="info-icon-wrapper"
        tabIndex={0}
        ref={iconRef}
        onMouseEnter={() => setOpenIndex(index)}
        onMouseLeave={() => openIndex === index && setOpenIndex(null)}
        onFocus={() => setOpenIndex(index)}
        onBlur={() => openIndex === index && setOpenIndex(null)}
        style={{ display: 'inline-block', position: 'relative', marginLeft: 8, zIndex: openIndex === index ? 9998 : 1 }}
      >
        <span
          className="info-icon"
          aria-label="Info"
          style={{
            cursor: 'pointer',
            width: 22,
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.13)',
            border: '2px solid #23234a',
            transition: 'background 0.2s',
            position: 'relative',
            zIndex: openIndex === index ? 9998 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{display:'block'}}>
            <circle cx="10" cy="10" r="10" fill="none"/>
            <text x="10" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">i</text>
          </svg>
        </span>
      </span>
      {showPopover && ReactDOM.createPortal(
        <div
          className="info-popover"
          style={{
            position: 'absolute',
            left: popoverPos.left,
            top: popoverPos.top,
            transform: 'translateX(-50%)',
            minWidth: 220,
            zIndex: 9999,
            background: 'rgba(30,34,54,0.98)',
            borderRadius: 18,
            boxShadow: '0 8px 32px 0 rgba(44,19,56,0.22)',
            padding: 0,
            backdropFilter: 'blur(8px)',
            border: '2px solid #00f2fe',
            animation: 'fadeIn 0.18s',
            pointerEvents: 'auto',
          }}
        >
          {/* Triangle/caret */}
          <div style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '12px solid #00f2fe',
            zIndex: 10000,
          }} />
          {/* Modern header with icon and new label */}
          <div style={{
            background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            padding: '0.7rem 1rem 0.6rem 1rem',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.13rem',
            textAlign: 'center',
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#fff" opacity="0.18"/><path d="M10 2C6.13 2 3 5.13 3 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26C15.81 13.47 17 11.38 17 9c0-3.87-3.13-7-7-7zm1 14h-2v-2h2v2zm1.07-7.75l-.9.92C10.45 9.9 10.25 10.5 10.25 11h-1.5v-.25c0-.83.34-1.63.93-2.22l1.24-1.26A2 2 0 0010 5a2 2 0 00-2 2H6a4 4 0 018 0c0 1.1-.45 2.1-1.18 2.83z" fill="#fff"/></svg>
            <span style={{fontWeight: 700, fontSize: '1.08rem', letterSpacing: '0.01em'}}>About This Setting</span>
          </div>
          <div style={{
            padding: '1.1rem 1.1rem 1rem 1.1rem',
            color: '#e0f7fa',
            fontSize: '1.04rem',
            textAlign: 'center',
            fontWeight: 400,
            lineHeight: 1.5,
          }}>
            {text}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

const IntroDropRound = ({ hideSaveButton }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [openIndex, setOpenIndex] = useSharedPopover();
  // Store last valid values for each field
  const lastValid = useRef({ ...defaultSettings });

  // Handle text input for numbers
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    // Only allow empty or numeric values
    if (value === '' || /^\d+$/.test(value)) {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  // On blur, restore last valid value if empty
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '' || isNaN(Number(value))) {
      setSettings(prev => ({ ...prev, [name]: lastValid.current[name] }));
    } else {
      // Save as number and update last valid
      setSettings(prev => {
        const newVal = Number(value);
        lastValid.current[name] = newVal;
        return { ...prev, [name]: newVal };
      });
    }
  };

  // For toggles
  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : prev[name]
    }));
  };

  // Helper to get index for each setting
  const getIndex = (key) => {
    return [
      'randomDuration',
      'introDuration',
      'winningPoints',
      'timeBetweenQuestions',
      'numberOfQuestions'
    ].indexOf(key);
  };

  return (
    <form className="settings-form" autoComplete="off" spellCheck="false">
      {/* Random Duration Toggle */}
      <div className={rowClass} style={{marginTop: '0.5rem'}}>
        <label className={labelClass} htmlFor="randomDuration">
          Random Duration
          <InfoPopover text={infoDescriptions.randomDuration} index={getIndex('randomDuration')} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        </label>
        <div className={toggleClass}>
          <input
            type="checkbox"
            id="randomDuration"
            name="randomDuration"
            checked={settings.randomDuration}
            onChange={handleChange}
            className={checkboxClass}
          />
        </div>
      </div>
      {/* Intro Duration (only if not random) */}
      {!settings.randomDuration && (
        <div className={rowClass}>
          <label className={labelClass} htmlFor="introDuration">
            Intro Duration
            <InfoPopover text={infoDescriptions.introDuration} index={getIndex('introDuration')} openIndex={openIndex} setOpenIndex={setOpenIndex} />
          </label>
          <div className={inputWrapperClass}>
            <input
              type="text"
              id="introDuration"
              name="introDuration"
              value={settings.introDuration === 0 ? '' : settings.introDuration}
              onChange={handleTextChange}
              onBlur={handleBlur}
              className={inputClass}
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              max="60"
            />
            <span className={unitClass}>sec</span>
          </div>
        </div>
      )}
      {/* Winning Points */}
      <div className={rowClass}>
        <label className={labelClass} htmlFor="winningPoints">
          Winning Points
          <InfoPopover text={infoDescriptions.winningPoints} index={getIndex('winningPoints')} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        </label>
        <div className={inputWrapperClass}>
          <input
            type="text"
            id="winningPoints"
            name="winningPoints"
            value={settings.winningPoints === 0 ? '' : settings.winningPoints}
            onChange={handleTextChange}
            onBlur={handleBlur}
            className={inputClass}
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="100"
          />
          <span className={unitClass}>pts</span>
        </div>
      </div>
      {/* Time Between Questions */}
      <div className={rowClass}>
        <label className={labelClass} htmlFor="timeBetweenQuestions">
          Time Between
          <InfoPopover text={infoDescriptions.timeBetweenQuestions} index={getIndex('timeBetweenQuestions')} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        </label>
        <div className={inputWrapperClass}>
          <input
            type="text"
            id="timeBetweenQuestions"
            name="timeBetweenQuestions"
            value={settings.timeBetweenQuestions === 0 ? '' : settings.timeBetweenQuestions}
            onChange={handleTextChange}
            onBlur={handleBlur}
            className={inputClass}
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="60"
          />
          <span className={unitClass}>sec</span>
        </div>
      </div>
      {/* Number of Questions */}
      <div className={rowClass}>
        <label className={labelClass} htmlFor="numberOfQuestions">
          Questions
          <InfoPopover text={infoDescriptions.numberOfQuestions} index={getIndex('numberOfQuestions')} openIndex={openIndex} setOpenIndex={setOpenIndex} />
        </label>
        <div className={inputWrapperClass}>
          <input
            type="text"
            id="numberOfQuestions"
            name="numberOfQuestions"
            value={settings.numberOfQuestions === 0 ? '' : settings.numberOfQuestions}
            onChange={handleTextChange}
            onBlur={handleBlur}
            className={inputClass}
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="50"
          />
          <span className={unitClass} style={{visibility: 'hidden'}}>pts</span>
        </div>
      </div>
      {/* Save button only if not hidden (for standalone use) */}
      {!hideSaveButton && (
        <button
          type="button"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          style={{marginTop: '1.5rem'}}
        >
          Save Settings
        </button>
      )}
    </form>
  );
};

export default IntroDropRound; 