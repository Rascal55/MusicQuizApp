import React, { useState, useRef } from 'react';

const labelClass = 'setting-label';
const rowClass = 'setting-row';
const inputWrapperClass = 'setting-input-wrapper';
const inputClass = 'setting-input';
const unitClass = 'setting-unit';
const toggleClass = 'setting-toggle';
const checkboxClass = 'setting-checkbox';

const defaultSettings = {
  randomDuration: true,
  introDuration: 5,
  winningPoints: 10,
  timeBetweenQuestions: 10,
  numberOfQuestions: 10
};

const IntroDropRound = ({ hideSaveButton }) => {
  const [settings, setSettings] = useState(defaultSettings);
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

  return (
    <form className="settings-form" autoComplete="off" spellCheck="false">
      {/* Random Duration Toggle */}
      <div className={rowClass} style={{marginTop: '0.5rem'}}>
        <label className={labelClass} htmlFor="randomDuration">Random Duration</label>
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
          <label className={labelClass} htmlFor="introDuration">Intro Duration</label>
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
        <label className={labelClass} htmlFor="winningPoints">Winning Points</label>
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
        <label className={labelClass} htmlFor="timeBetweenQuestions">Time Between</label>
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
        <label className={labelClass} htmlFor="numberOfQuestions">Questions</label>
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