import React, { useState } from 'react';
import IntroDropRound from '../components/rounds/IntroDropRound';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('game');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center py-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">Settings</h1>
        <div className="flex justify-center border-b border-gray-200 mb-8">
          <button
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'game'
                ? 'border-b-4 border-indigo-500 text-indigo-700 bg-indigo-50'
                : 'text-gray-400 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('game')}
          >
            Game Settings
          </button>
          <button
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'round'
                ? 'border-b-4 border-indigo-500 text-indigo-700 bg-indigo-50'
                : 'text-gray-400 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('round')}
          >
            Round Settings
          </button>
        </div>
        {activeTab === 'game' && (
          <div className="p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Game Settings</h2>
            {/* Add your game settings form here */}
          </div>
        )}
        {activeTab === 'round' && (
          <div className="p-0 bg-transparent rounded-2xl shadow-none">
            <div className="round-carousel-card-body">
              {selectedRounds[activeRoundIdx].name === 'Intro Drop' ? (
                <IntroDropRound />
              ) : (
                <div style={{color: '#60efff', margin: '1.2rem 0'}}>Settings for {selectedRounds[activeRoundIdx].name} go here.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage; 