const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS setup for frontend connection
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173" // Your React app URL
}));
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Music Quiz Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// In-memory storage for games (replace with database later)
const activeGames = new Map();

// Game creation endpoint
app.post('/api/game/create', (req, res) => {
  try {
    console.log('🎮 Creating new game...');
    console.log('📋 Game config received:', req.body);
    
    const gameConfig = req.body;
    
    // Validate required fields
    if (!gameConfig.gameId || !gameConfig.gameSettings || !gameConfig.rounds) {
      return res.status(400).json({ 
        error: 'Missing required game configuration' 
      });
    }
    
    // Check if game ID already exists
    if (activeGames.has(gameConfig.gameId)) {
      return res.status(409).json({ 
        error: 'Game with this code already exists' 
      });
    }
    
    // Create game session
    const gameSession = {
      ...gameConfig,
      createdAt: new Date().toISOString(),
      status: 'lobby',
      players: [],
      hostSocketId: null // Will be set when host connects via socket
    };
    
    // Store game session
    activeGames.set(gameConfig.gameId, gameSession);
    
    console.log(`✅ Game created: ${gameConfig.gameId}`);
    console.log(`📊 Active games: ${activeGames.size}`);
    
    // Return success response
    res.status(201).json({
      success: true,
      gameId: gameConfig.gameId,
      joinCode: gameConfig.gameId,
      status: 'lobby',
      message: 'Game created successfully'
    });
    
  } catch (error) {
    console.error('❌ Error creating game:', error);
    res.status(500).json({ 
      error: 'Failed to create game',
      details: error.message 
    });
  }
});

// Get game info endpoint
app.get('/api/game/:gameId', (req, res) => {
  try {
    const gameId = req.params.gameId.toUpperCase();
    const game = activeGames.get(gameId);
    
    if (!game) {
      return res.status(404).json({ 
        error: 'Game not found' 
      });
    }
    
    // Return game info (without sensitive data)
    res.json({
      gameId: game.gameId,
      status: game.status,
      playerCount: game.players.length,
      maxPlayers: game.gameSettings.maxPlayers,
      rounds: game.rounds.map(round => ({
        roundNumber: round.roundNumber,
        roundName: round.roundName
      }))
    });
    
  } catch (error) {
    console.error('❌ Error getting game:', error);
    res.status(500).json({ 
      error: 'Failed to get game info' 
    });
  }
});

// List active games endpoint (for debugging)
app.get('/api/games', (req, res) => {
  const games = Array.from(activeGames.values()).map(game => ({
    gameId: game.gameId,
    status: game.status,
    playerCount: game.players.length,
    createdAt: game.createdAt
  }));
  
  res.json({ 
    activeGames: games.length,
    games: games 
  });
});

// Game cleanup endpoint
app.delete('/api/game/:gameId', (req, res) => {
    try {
      const gameId = req.params.gameId.toUpperCase();
      
      if (activeGames.has(gameId)) {
        activeGames.delete(gameId);
        console.log(`🗑️ Game deleted: ${gameId}`);
        console.log(`📊 Active games: ${activeGames.size}`);
        
        res.json({ 
          success: true, 
          message: 'Game deleted successfully' 
        });
      } else {
        res.status(404).json({ 
          error: 'Game not found' 
        });
      }
    } catch (error) {
      console.error('❌ Error deleting game:', error);
      res.status(500).json({ 
        error: 'Failed to delete game' 
      });
    }
  });
  
  // Auto-cleanup old games (run every 10 minutes)
  setInterval(() => {
    const now = new Date();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    
    let cleanedCount = 0;
    for (const [gameId, game] of activeGames.entries()) {
      const age = now - new Date(game.createdAt);
      if (age > maxAge) {
        activeGames.delete(gameId);
        cleanedCount++;
        console.log(`🧹 Auto-cleaned old game: ${gameId}`);
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} old games. Active games: ${activeGames.size}`);
    }
  }, 10 * 60 * 1000); // Run every 10 minutes

// Socket.IO connection handling with player management
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
    
    // Host creates/joins game room
    socket.on('host-join-game', (data) => {
      const { gameId } = data;
      console.log(`🎮 Host joining game room: ${gameId}`);
      
      socket.join(gameId);
      socket.gameId = gameId;
      socket.isHost = true;
      
      // Update game with host socket ID
      const game = activeGames.get(gameId);
      if (game) {
        game.hostSocketId = socket.id;
        console.log(`✅ Host connected to game: ${gameId}`);
      }
    });
    
    // Player joins game
    socket.on('player-join-game', (data) => {
      const { gameId, playerName } = data;
      console.log(`👤 Player "${playerName}" joining game: ${gameId}`);
      
      const game = activeGames.get(gameId);
      if (!game) {
        socket.emit('join-error', { message: 'Game not found' });
        return;
      }
      
      // Check if game is full
      if (game.players.length >= game.gameSettings.maxPlayers) {
        socket.emit('join-error', { message: 'Game is full' });
        return;
      }
      
      // Check for duplicate names
      const nameExists = game.players.some(p => p.name.toLowerCase() === playerName.toLowerCase());
      if (nameExists) {
        socket.emit('join-error', { message: 'Name already taken' });
        return;
      }
      
      // Add player to game
      const player = {
        id: socket.id,
        name: playerName,
        joinedAt: Date.now(),
        score: 0,
        isReady: true
      };
      
      game.players.push(player);
      
      // Join socket room
      socket.join(gameId);
      socket.gameId = gameId;
      socket.playerName = playerName;
      socket.isHost = false;
      
      console.log(`✅ Player "${playerName}" joined game ${gameId}. Players: ${game.players.length}/${game.gameSettings.maxPlayers}`);
      
      // Notify player they joined successfully
      socket.emit('join-success', {
        gameId: gameId,
        playerName: playerName,
        playerId: socket.id
      });
      
      // Notify all clients in the game about updated player list
      io.to(gameId).emit('players-updated', {
        players: game.players,
        playerCount: game.players.length
      });
    });
    
    // Player disconnection
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
      
      if (socket.gameId) {
        const game = activeGames.get(socket.gameId);
        if (game) {
          if (socket.isHost) {
            // Host disconnected - handle gracefully
            console.log(`🎮 Host disconnected from game: ${socket.gameId}`);
            game.hostSocketId = null;
          } else if (socket.playerName) {
            // Player disconnected - remove from game
            const playerIndex = game.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
              game.players.splice(playerIndex, 1);
              console.log(`👤 Player "${socket.playerName}" left game ${socket.gameId}. Players: ${game.players.length}/${game.gameSettings.maxPlayers}`);
              
              // Notify remaining players
              io.to(socket.gameId).emit('players-updated', {
                players: game.players,
                playerCount: game.players.length
              });
            }
          }
        }
      }
    });
    
    // Game start (host only)
    socket.on('start-game', (data) => {
      if (!socket.isHost) {
        socket.emit('error', { message: 'Only host can start game' });
        return;
      }
      
      const game = activeGames.get(socket.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }
      
      if (game.players.length < 2) {
        socket.emit('error', { message: 'Need at least 2 players to start' });
        return;
      }
      
      game.status = 'starting';
      console.log(`🚀 Game ${socket.gameId} starting with ${game.players.length} players`);
      
      // Notify all players game is starting
      io.to(socket.gameId).emit('game-starting', {
        countdown: 3 // 3 second countdown
      });
      
      // Start countdown
      setTimeout(() => {
        game.status = 'active';
        io.to(socket.gameId).emit('game-started', {
          message: 'Game has started!'
        });
      }, 3000);
    });
  });

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Music Quiz Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});