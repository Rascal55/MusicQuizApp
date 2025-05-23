// Default settings for each round type
export const defaultRoundSettings = {
  'Intro Drop': {
    winPoints: 10, // Points for nailing it
    guessWindow: 60, // Time to drop your guess
    coolDown: 10, // Breather between bangers
    roundSize: 10, // How many tracks to tackle
    surpriseMute: true, // Random or fixed mute timing
    muteDelay: 5, // Fixed mute countdown (if surpriseMute is off)
  },
  'Movie Match': {
    playDuration: 15, // seconds of music to play
    maxPoints: 10,
    timeLimit: 30, // seconds to guess
    showTimer: true,
    showProgress: true,
    pointsDistribution: {
      first: 10,
      second: 5,
      third: 3
    }
  },
  'Tune Dash': {
    playDuration: 10, // seconds of music to play
    maxPoints: 10,
    timeLimit: 30, // seconds to guess
    showTimer: true,
    showProgress: true,
    pointsDistribution: {
      first: 10,
      second: 5,
      third: 3
    }
  },
  'Album Gamble': {
    displayDuration: 20, // seconds to view album
    maxPoints: 15,
    timeLimit: 45, // seconds to guess
    showTimer: true,
    showProgress: true,
    allowDuplicates: false
  },
  'Hit Year': {
    playDuration: 15, // seconds of music to play
    maxPoints: 10,
    timeLimit: 30, // seconds to guess
    showTimer: true,
    showProgress: true,
    yearRange: {
      min: 1950,
      max: 2024
    }
  },
  'Cover Clash': {
    playDuration: 20, // seconds of music to play
    maxPoints: 15,
    timeLimit: 45, // seconds to guess
    showTimer: true,
    showProgress: true,
    pointsDistribution: {
      artistOnly: 5,
      artistAndSong: 15
    }
  }
};

// Helper function to get default settings for a round type
export function getDefaultSettings(roundType) {
  return defaultRoundSettings[roundType] || {};
}

// Helper function to validate settings
export function validateSettings(roundType, settings) {
  const defaults = getDefaultSettings(roundType);
  const validated = { ...defaults };

  // Ensure all required settings are present and valid
  for (const [key, value] of Object.entries(settings)) {
    if (defaults.hasOwnProperty(key)) {
      validated[key] = value;
    }
  }

  return validated;
} 