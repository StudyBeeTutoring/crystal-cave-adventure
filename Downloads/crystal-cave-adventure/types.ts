
export interface Item {
  id: string;
  name: string;
  description: string; // General description (e.g., for inventory)
  descriptionInRoom: string; // Description when seen in a room
  canTake: boolean;
  onUse?: (
    gameState: GameState,
    updateGameState: (newState: Partial<GameState>, energyDelta?: number) => void,
    addItemToLocation: (itemId: string, locationId: string) => void, // Added for use cases like emptying a container
    removeItemFromPlayer: (itemId: string) => void, // Added for consumable items
    targetName?: string
  ) => string; // Message to display after use
  isFood?: boolean;
  energyRestored?: number;
}

export interface Exit {
  direction: string;
  to: string; // Location ID
  isLocked?: boolean;
  requiredFlag?: string; // e.g., "chasmBridged"
  lockedMessage?: string;
  conditionNotMetMessage?: string;
  energyCost?: number; // Optional energy cost for this specific exit
}

export interface LocationFeature {
  id: string;
  name: string;
  description: string;
  isInteractable?: boolean; // Can it be targeted by 'use' or other commands?
}

export interface LocationDefinition {
  id: string;
  name: string;
  image: string;
  baseDescription: string; // Static part of the description
  initialItems: string[]; // Item IDs
  features?: LocationFeature[]; // Static features in the room
  exits: Exit[];
  onCommand?: ( // For location-specific commands like riddle answers or complex interactions
    command: string,
    args: string[],
    gameState: GameState,
    updateGameState: (newState: Partial<GameState>, energyDelta?: number) => void,
    addItemToLocation: (itemId: string, locationId: string) => void,
    removeItemFromPlayer: (itemId: string) => void,
    addItemToPlayer: (itemId: string) => void
  ) => string | false; // Return message or false if command not handled
  onEnter?: ( // Action triggered when entering the location
    gameState: GameState,
    updateGameState: (newState: Partial<GameState>, energyDelta?: number) => void
  ) => string | void; // Optional message
}

export interface PlayerState {
  currentLocationId: string;
  inventory: string[]; // Item IDs
  energy: number;
  maxEnergy: number;
}

export interface GameMessage {
  id: string;
  text: string;
  type: 'info' | 'error' | 'success' | 'location' | 'narration' | 'system' | 'item' | 'energy';
}

export interface GameState {
  player: PlayerState;
  messages: GameMessage[];
  gameOver: boolean;
  gameWon: boolean;
  flags: Record<string, boolean>; // e.g., { chasmBridged: true, riddleSolved: false, torchLit: false, raftBuilt: false, mechanismActivated: false, bootsFound: false }
  worldItems: Record<string, string[]>; // LocationID -> array of itemIDs
}

export type CommandHandler = (
  args: string[],
  gameState: GameState,
  updateGameState: (newState: Partial<GameState>, energyDelta?: number) => void,
  addItemToLocation: (itemId: string, locationId: string) => void,
  removeItemFromPlayer: (itemId: string) => void,
  addItemToPlayer: (itemId: string) => void,
  removeItemFromLocation: (itemId: string, locationId: string) => void
) => string;