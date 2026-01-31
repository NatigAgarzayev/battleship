import { toast } from 'sonner'
import { Anchor, AlertCircle, CheckCircle, XCircle, Info, Ship, Target, Trophy, Skull } from 'lucide-react'

// Success toasts
export const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
        description,
        duration: 3000,
    })
}

// Error toasts
export const showError = (message: string, description?: string) => {
    toast.error(message, {
        description,
        duration: 4000,
    })
}

// Info toasts
export const showInfo = (message: string, description?: string) => {
    toast.info(message, {
        description,
        duration: 3000,
    })
}

// Warning toasts
export const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
        description,
        duration: 3000,
    })
}

// Game-specific toasts
export const gameToasts = {
    // Room/Game errors
    roomFull: () => showError('Room Full', 'This game already has 2 players'),
    gameNotFound: () => showError('Game Not Found', 'Please check the game code and try again'),
    gameEnded: () => showInfo('Game Ended', 'This game has already finished'),
    invalidGameCode: () => showError('Invalid Game Code', 'Please enter a valid 6-character code'),

    // Join/Create success
    gameCreated: (gameCode: string) => showSuccess('Game Created!', `Share code: ${gameCode}`),
    joinedGame: () => showSuccess('Joined Game!', 'Get ready to place your ships'),

    // Ship placement
    invalidPlacement: () => showError('Invalid Placement', 'Ships must have 1 cell spacing'),
    shipPlaced: (shipName: string) => showInfo(`${shipName} Placed`, ''),
    allShipsPlaced: () => showSuccess('Fleet Ready!', 'Click "Start Game" when ready'),

    // Battle actions
    cellAlreadyShot: () => showWarning('Already Attacked', 'Choose a different cell'),
    notYourTurn: () => showWarning('Not Your Turn', 'Wait for your opponent'),
    hit: () => showSuccess('Direct Hit! 🎯', 'You hit an enemy ship!'),
    miss: () => showInfo('Miss', 'No ship at that location'),
    shipSunk: (shipName: string) => showSuccess(`${shipName} Destroyed! 💥`, 'Enemy ship eliminated'),

    // Game over
    victory: () => showSuccess('Victory! 🎉', 'You destroyed the enemy fleet!'),
    defeat: () => showInfo('Defeat', 'Your fleet was destroyed'),
    opponentLeft: () => showInfo('Opponent Left', 'You win by default'),

    // Leave game
    leftGame: () => showInfo('Left Game', 'Returning to lobby'),
    forfeitedGame: () => showInfo('Game Forfeited', 'You have left the battle'),

    // Connection
    opponentDisconnected: () => showWarning('Opponent Disconnected', 'Waiting for reconnection...'),
    opponentReconnected: () => showSuccess('Opponent Reconnected', 'Game continues'),

    // Time
    timeRunningOut: () => showWarning('Time Running Out!', 'Make your move quickly'),
    timeExpired: () => showInfo('Time Expired', 'Random attack executed'),

    // Copy
    codeCopied: () => showSuccess('Link Copied!', 'Share it with your opponent'),
}