
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameMessage, LocationDefinition, Item, CommandHandler, LocationFeature } from './types';
import { LOCATIONS, ITEMS } from './gameData';
import { Header } from './components/Header';
import { LocationImage } from './components/LocationImage';
import { MessageLog } from './components/MessageLog';
import { CommandInput } from './components/CommandInput';
import { StatusBar } from './components/StatusBar';

// Helper function to find an item by a partial or full name from a list of item IDs
export const findItemByName = (namePart: string, itemIds: string[], allItems: Record<string, Item>): Item | undefined => {
    const targetName = namePart.toLowerCase().trim();
    if (!targetName) return undefined;

    const availableItems = itemIds.map(id => allItems[id]).filter(Boolean);

    // Strategy 1: Exact match on full name
    for (const item of availableItems) {
        if (item.name.toLowerCase() === targetName) {
            return item;
        }
    }

    // Strategy 2: Input is a substring of an item name or all input words are in item name
    const inputWords = targetName.split(/\s+/).filter(w => w.length > 0);
    let bestMatch: Item | undefined = undefined;
    let bestMatchScore = 0; // Higher score means better match

    for (const item of availableItems) {
        const itemNameLower = item.name.toLowerCase();
        let currentScore = 0;

        // Full phrase substring match: "old key" in "very old key"
        if (itemNameLower.includes(targetName)) {
            currentScore = targetName.length * 2; // Prioritize full phrase match
        }

        // All input words match: input "key old" for item "old key"
        if (inputWords.every(word => itemNameLower.includes(word))) {
            currentScore = Math.max(currentScore, inputWords.join("").length);
        }
        
        // Single word input matches any word in item name: "key" for "old key"
        if (inputWords.length === 1) {
            const itemWords = itemNameLower.split(/\s+/);
            if (itemWords.includes(inputWords[0])) {
                 currentScore = Math.max(currentScore, inputWords[0].length / 2); // Lower priority
            }
        }

        if (currentScore > bestMatchScore) {
            bestMatch = item;
            bestMatchScore = currentScore;
        } else if (currentScore === bestMatchScore && bestMatch && item.name.length < bestMatch.name.length) {
            // Prefer shorter item names on tie, assuming more specific
            bestMatch = item;
        }
    }
    return bestMatch;
};

// Helper function to find a feature by a partial or full name
export const findFeatureByName = (namePart: string, features: LocationFeature[] | undefined): LocationFeature | undefined => {
    if (!features) return undefined;
    const targetName = namePart.toLowerCase().trim();
    if (!targetName) return undefined;

    // Strategy 1: Exact match
    for (const feature of features) {
        if (feature.name.toLowerCase() === targetName) {
            return feature;
        }
    }
    // Strategy 2: Input is a substring of feature name
    for (const feature of features) {
        if (feature.name.toLowerCase().includes(targetName)) {
            return feature; // First substring match
        }
    }
    return undefined;
};


const App: React.FC = () => {
  const initialWorldItems: Record<string, string[]> = {};
  Object.keys(LOCATIONS).forEach(locId => {
    initialWorldItems[locId] = [...LOCATIONS[locId].initialItems];
  });

  const [gameState, setGameState] = useState<GameState>({
    player: {
      currentLocationId: 'cave_entrance',
      inventory: [],
      energy: 100,
      maxEnergy: 100,
    },
    messages: [],
    gameOver: false,
    gameWon: false,
    flags: {
      torchLit: false,
      chasmBridged: false,
      riddleSolved: false,
      chestUnlocked: false,
      crystalBoxOpened: false,
      crystalKeyUsed: false,
      bootsWarned: false,
      raftBuilt: false,
      gearPlacedInMechanism: false,
      leverPlacedInMechanism: false,
      crystalKeyPlacedInNiche: false,
      antechamberMechanismActivated: false,
    },
    worldItems: initialWorldItems,
  });

  const addMessage = useCallback((text: string, type: GameMessage['type']) => {
    setGameState(prev => ({
      ...prev,
      messages: [...prev.messages, { id: Date.now().toString() + Math.random(), text, type }],
    }));
  }, []);
  
  const updateGameState = useCallback((newState: Partial<GameState>, energyDelta: number = 0) => {
    setGameState(prev => {
        let newPlayerState = { ...prev.player };
        if (newState.player) { // If player state is being directly updated
            newPlayerState = {...newPlayerState, ...newState.player};
        }

        if (energyDelta !== 0) {
            newPlayerState.energy = Math.max(0, Math.min(newPlayerState.maxEnergy, newPlayerState.energy + energyDelta));
        }
        
        const updatedState = { ...prev, ...newState, player: newPlayerState };

        if (newPlayerState.energy <= 0 && !updatedState.gameOver && !updatedState.gameWon) { 
            updatedState.gameOver = true;
            updatedState.gameWon = false;
        }
        return updatedState;
    });
  }, []);

  const addItemToPlayer = useCallback((itemId: string) => {
    if (ITEMS[itemId]) {
      setGameState(prev => ({
        ...prev,
        player: { ...prev.player, inventory: [...prev.player.inventory, itemId] },
      }));
    }
  }, []);

  const removeItemFromPlayer = useCallback((itemId: string) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        inventory: prev.player.inventory.filter(id => id !== itemId),
      },
    }));
  }, []);
  
  const addItemToLocation = useCallback((itemId: string, locationId: string) => {
    setGameState(prev => ({
      ...prev,
      worldItems: {
        ...prev.worldItems,
        [locationId]: [...(prev.worldItems[locationId] || []), itemId],
      }
    }));
  }, []);

  const removeItemFromLocation = useCallback((itemId: string, locationId: string) => {
    setGameState(prev => ({
      ...prev,
      worldItems: {
        ...prev.worldItems,
        [locationId]: (prev.worldItems[locationId] || []).filter(id => id !== itemId),
      }
    }));
  }, []);

  const describeLocation = useCallback((locationId: string) => {
    const location = LOCATIONS[locationId];
    if (!location) return;

    addMessage(location.name, 'location');
    
    let dynamicDescription = location.baseDescription;
    if (locationId === 'dark_passage' && gameState.flags.torchLit) {
        dynamicDescription = "With your torch lit, the passage is still gloomy but navigable. Paths lead north (Chasm), east (Cobwebs), and south (Entrance).";
    }
    if (locationId === 'chasm_edge' && gameState.flags.chasmBridged) {
        dynamicDescription += " Your sturdy rope bridge spans the chasm to the north.";
    } else if (locationId === 'chasm_edge' && gameState.flags.raftBuilt) {
        dynamicDescription += " You recall using your rope for the raft; the chasm remains unbridged.";
    }
    if (locationId === 'alcove' && gameState.flags.riddleSolved && (gameState.worldItems[locationId]?.includes('old_key'))) {
        dynamicDescription += " The secret panel where you found the key is open.";
    } else if (locationId === 'alcove' && gameState.flags.riddleSolved && !gameState.worldItems[locationId]?.includes('old_key') && !gameState.player.inventory.includes('old_key')) {
        dynamicDescription += " The secret panel is empty.";
    }
    if (locationId === 'crystal_chamber' && gameState.flags.crystalBoxOpened && !gameState.worldItems[locationId]?.includes('crystal_key') && !gameState.player.inventory.includes('crystal_key')) {
        dynamicDescription = dynamicDescription.replace("On a simple stone pedestal is a small, ornate box.", "The ornate box on the pedestal is open and empty.");
    } else if (locationId === 'crystal_chamber' && gameState.flags.crystalBoxOpened) {
         dynamicDescription = dynamicDescription.replace("On a simple stone pedestal is a small, ornate box.", "The ornate box on the pedestal is open.");
    }
    if (locationId === 'underground_river_access' && gameState.flags.raftBuilt) {
        dynamicDescription += " Your makeshift raft bobs gently at the water's edge, ready for crossing.";
    }
     if (locationId === 'locked_door_room' && gameState.flags.chestUnlocked) {
        dynamicDescription = dynamicDescription.replace("An old, locked wooden chest sits in one corner. It appears to be securely locked.", "The old wooden chest in the corner is open and empty, revealing a small hidden nook behind it.");
        dynamicDescription = dynamicDescription.replace("An old, locked wooden chest sits in the corner.", "The old wooden chest in the corner is open and empty, revealing a small hidden nook behind it."); // Handle both original phrasings
    }
    if (locationId === 'sunstone_antechamber') {
        let mechanismStatus = "In the center of the room is a complex mechanism with slots for a gear and a lever. There's also a small, crystal-lined niche that looks like it might fit a special key.";
        if (gameState.flags.antechamberMechanismActivated) {
             mechanismStatus = "The mechanism is fully assembled and hums with power! The great door to the north has rumbled open!";
        } else {
            let parts = [];
            if (gameState.flags.gearPlacedInMechanism) parts.push("gear is in place");
            if (gameState.flags.leverPlacedInMechanism) parts.push("lever is inserted");
            if (gameState.flags.crystalKeyPlacedInNiche) parts.push("crystal key glows in its niche");
            if (parts.length > 0) {
                mechanismStatus = `The mechanism has the ${parts.join(', ')}. It seems to be waiting for more components or activation.`;
            }
        }
        // Replace the original description of the mechanism section
        dynamicDescription = dynamicDescription.replace("In the center of the room is a complex mechanism with slots for a gear and a lever. There's also a small, crystal-lined niche that looks like it might fit a special key.", mechanismStatus);
    }

    addMessage(dynamicDescription, 'narration');

    const itemsInRoom = gameState.worldItems[locationId]?.map(id => ITEMS[id]).filter(Boolean);
    if (itemsInRoom && itemsInRoom.length > 0) {
      itemsInRoom.forEach(item => {
        if(item.id === 'chest' && gameState.flags.chestUnlocked) return;
        addMessage(`You see: ${ITEMS[item.id]?.descriptionInRoom || item.name}.`, 'item');
      });
    }
    
    location.features?.forEach(feature => {
        addMessage(`You notice: ${feature.name}. (${feature.description})`, 'item');
    });

    let exitStrings: string[] = [];
    location.exits.forEach(exit => {
        let available = true;
        if (exit.requiredFlag && !gameState.flags[exit.requiredFlag]) {
            available = false;
        }
        if (exit.requiredFlag === 'chasmBridged' && gameState.flags.raftBuilt) available = false;
        if (exit.requiredFlag === 'raftBuilt' && gameState.flags.chasmBridged) available = false;

        if (available) {
            exitStrings.push(`${exit.direction} (${LOCATIONS[exit.to]?.name || exit.to})`);
        }
    });
    if (exitStrings.length > 0) {
        addMessage(`Obvious exits: ${exitStrings.join(', ')}.`, 'info');
    } else {
        addMessage("There are no obvious exits.", 'info');
    }

  }, [addMessage, gameState.flags, gameState.worldItems, gameState.player.inventory]);

  const previousLocationIdRef = useRef<string | null>(null);

  useEffect(() => {
    addMessage("Welcome to the Crystal Cave Adventure!", 'system');
    addMessage("Your goal is to find the legendary Sunstone. Type 'help' for a list of commands.", 'system');
    addMessage(`You start with ${gameState.player.energy} energy. Moving consumes energy. Find food to replenish it!`, 'energy');
    describeLocation(gameState.player.currentLocationId);
    previousLocationIdRef.current = gameState.player.currentLocationId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (previousLocationIdRef.current && previousLocationIdRef.current !== gameState.player.currentLocationId) {
        describeLocation(gameState.player.currentLocationId);
        previousLocationIdRef.current = gameState.player.currentLocationId;
    }
  }, [gameState.player.currentLocationId, describeLocation]);

  const commandHandlers: Record<string, CommandHandler> = {
    go: (args, gs, ugs) => {
      const direction = args[0]?.toLowerCase();
      if (!direction) return "Go where?";
      
      const currentLocationDef = LOCATIONS[gs.player.currentLocationId];
      const exit = currentLocationDef.exits.find(e => e.direction.toLowerCase() === direction);

      if (!exit) return `You can't go ${direction}.`;
      if (exit.isLocked) return exit.lockedMessage || "That way is locked.";
      if (exit.requiredFlag && !gs.flags[exit.requiredFlag]) {
        if (exit.requiredFlag === 'chasmBridged' && gs.flags.raftBuilt) {
            return "You used your rope to build the raft, so you can't build a bridge here.";
        }
        if (exit.requiredFlag === 'raftBuilt' && gs.flags.chasmBridged) {
            return "You used your rope to build the bridge, so you can't build a raft.";
        }
        return exit.conditionNotMetMessage || "You can't go that way yet.";
      }
      
      const energyCost = exit.energyCost || 5;
      if (gs.player.energy <= energyCost && energyCost > 0) {
          return `You are too exhausted to move ${direction}. You need ${energyCost} energy but only have ${gs.player.energy}. Find some food!`;
      }
      
      const newLocationDef = LOCATIONS[exit.to];
      let onEnterMessage: string | void = undefined;
      if (newLocationDef.onEnter) {
          onEnterMessage = newLocationDef.onEnter(gs, ugs); // Pass ugs directly
      }
      
      // Important: updateGameState must be called with the new location AND energy change
      ugs({ player: { ...gs.player, currentLocationId: exit.to } }, -energyCost);
      
      let moveMessage = `You go ${direction}...`;
      if (energyCost > 0) {
          moveMessage += ` (-${energyCost} energy)`;
      }
      if (onEnterMessage) {
          // Add onEnterMessage after the move message, but before location description (which is handled by useEffect)
          // Or, ensure onEnterMessage is displayed appropriately. For now, adding it here.
          addMessage(onEnterMessage, 'narration');
      }
      return moveMessage;
    },
    look: (args, gs) => {
      const targetName = args.join(' ').trim();
      const currentLocation = LOCATIONS[gs.player.currentLocationId];

      if (!targetName || targetName.toLowerCase() === 'around' || targetName.toLowerCase() === 'room') {
        describeLocation(gs.player.currentLocationId);
        return ""; 
      }
      
      const itemInInventory = findItemByName(targetName, gs.player.inventory, ITEMS);
      if (itemInInventory) return `${itemInInventory.name}: ${itemInInventory.description}`;

      const itemInRoom = findItemByName(targetName, gs.worldItems[currentLocation.id] || [], ITEMS);
      if (itemInRoom) return `${itemInRoom.name}: ${itemInRoom.descriptionInRoom} ${itemInRoom.description}`;
      
      const featureInRoom = findFeatureByName(targetName, currentLocation.features);
      if (featureInRoom) return `${featureInRoom.name}: ${featureInRoom.description}`;

      const lowerTarget = targetName.toLowerCase();
      if (lowerTarget.includes('chest') && currentLocation.id === 'locked_door_room') {
          return gs.flags.chestUnlocked ? "The old chest is open and empty, revealing a passage behind it." : "A sturdy, locked old wooden chest. It looks like it needs a key.";
      }
       if (lowerTarget.includes('chasm') && currentLocation.id === 'chasm_edge') {
          return gs.flags.chasmBridged ? "The chasm is now spanned by your rope bridge." : (gs.flags.raftBuilt ? "The chasm remains. You used your rope for the raft." : "A wide, deep chasm. It's too far to jump across.");
      }
      if (lowerTarget.includes('river') && (currentLocation.id === 'underground_river_access' || currentLocation.id === 'far_river_bank')) {
          return gs.flags.raftBuilt ? "The river flows swiftly. Your raft is nearby." : "A wide, dark river flows swiftly. It looks too dangerous to swim.";
      }
      if (lowerTarget.includes('mechanism') && currentLocation.id === 'sunstone_antechamber') {
        let status = "It's a complex stone mechanism. ";
        if (gs.flags.antechamberMechanismActivated) status += "It's active and the door north is open!";
        else {
            const parts = [];
            if (gs.flags.gearPlacedInMechanism) parts.push("a gear is in place"); else parts.push("a slot for a gear is visible");
            if (gs.flags.leverPlacedInMechanism) parts.push("a lever is inserted"); else parts.push("a socket for a lever is visible");
            if (gs.flags.crystalKeyPlacedInNiche) parts.push("a crystal key glows in a niche"); else parts.push("a crystal-lined niche looks empty");
            status += parts.join(', ') + ".";
        }
        return status;
      }


      return `You don't see any "${targetName}" here.`;
    },
    take: (args, gs, ugs, ail, rfp, aip, rifl) => {
      const requestedItemName = args.join(' ').trim();
      if (!requestedItemName) return "Take what?";

      const locationId = gs.player.currentLocationId;
      const itemToTake = findItemByName(requestedItemName, gs.worldItems[locationId] || [], ITEMS);
      
      if (!itemToTake) return `There is no "${requestedItemName}" here to take. Try being more specific or check spelling.`;
      
      if (!itemToTake.canTake) return `You can't take the ${itemToTake.name}.`;

      rifl(itemToTake.id, locationId);
      aip(itemToTake.id);

      if (itemToTake.id === 'sunstone') {
          ugs({ gameWon: true, gameOver: true });
          return `You take the ${itemToTake.name}! A wave of warmth and power washes over you. You have found the Sunstone! Congratulations, you have won!`;
      }
      if (itemToTake.id === 'sturdy_boots' && !gs.flags.bootsFound) {
          ugs({ flags: {...gs.flags, bootsFound: true }});
          return `You take the ${itemToTake.name} and put them on. They feel much better for cave exploration!`;
      }
      let takeMessage = `You take the ${itemToTake.name}.`;
      if (itemToTake.id === 'torch' && !gs.flags.torchLit) {
          takeMessage += " It's currently unlit. Try 'use torch'.";
      }
      return takeMessage;
    },
    drop: (args, gs, ugs, ail, rfp) => {
        const requestedItemName = args.join(' ').trim();
        if (!requestedItemName) return "Drop what?";

        const itemToDrop = findItemByName(requestedItemName, gs.player.inventory, ITEMS);
        if (!itemToDrop) return `You don't have a "${requestedItemName}" to drop. Check your inventory or spelling.`;

        rfp(itemToDrop.id);
        ail(itemToDrop.id, gs.player.currentLocationId);
        return `You drop the ${itemToDrop.name}.`;
    },
    inventory: (args, gs) => {
      if (gs.player.inventory.length === 0) return "Your inventory is empty.";
      const itemNames = gs.player.inventory.map(id => ITEMS[id]?.name || 'unknown item').join(', ');
      return `You are carrying: ${itemNames}.`;
    },
    use: (args, gs, ugs, ail, rfp, aip, rifl) => {
        let itemNameInput: string;
        let targetNameInput: string | undefined;
        const onKeywordIndex = args.map(a => a.toLowerCase()).indexOf('on');

        if (onKeywordIndex !== -1) {
            itemNameInput = args.slice(0, onKeywordIndex).join(' ').trim();
            targetNameInput = args.slice(onKeywordIndex + 1).join(' ').trim().toLowerCase();
        } else {
            itemNameInput = args.join(' ').trim();
        }

        if (!itemNameInput) return "Use what?";
        const itemInInventory = findItemByName(itemNameInput, gs.player.inventory, ITEMS);
        if (!itemInInventory) return `You don't have a "${itemNameInput}" in your inventory.`;

        // Specific item on target interactions
        if (targetNameInput) {
            const currentLocId = gs.player.currentLocationId;
            if (itemInInventory.id === 'rope' && targetNameInput.includes('chasm') && currentLocId === 'chasm_edge') {
                if (gs.flags.chasmBridged) return "You've already used rope to make a bridge here.";
                if (gs.flags.raftBuilt) return "You've already used your rope for the raft.";
                rfp('rope'); 
                ugs({ flags: { ...gs.flags, chasmBridged: true } });
                return "You skillfully use the rope to create a makeshift bridge across the chasm. The way north is now open!";
            }
            if (itemInInventory.id === 'rope' && targetNameInput.includes('log') && currentLocId === 'underground_river_access' && gs.player.inventory.includes('rotting_log')) {
                if (gs.flags.raftBuilt) return "You've already built a raft.";
                if (gs.flags.chasmBridged) return "You've already used your rope for the bridge.";
                rfp('rope');
                rfp('rotting_log'); // Assume rotting_log is taken first
                ugs({ flags: { ...gs.flags, raftBuilt: true } });
                return "You use the rope to lash the rotting log together, creating a crude but serviceable raft! You can now try to 'cross river'.";
            }
            if (itemInInventory.id === 'old_key' && targetNameInput.includes('chest') && currentLocId === 'locked_door_room') {
                if (gs.flags.chestUnlocked) return "The chest is already unlocked.";
                 const chestItem = findItemByName(targetNameInput, gs.worldItems[currentLocId] || [], ITEMS);
                if (!chestItem || chestItem.id !== 'chest') return `There is no "${targetNameInput}" here to use the key on, or it's not a chest.`;

                rfp('old_key'); 
                ugs({ flags: { ...gs.flags, chestUnlocked: true } });
                const locDef = LOCATIONS['locked_door_room'];
                if (!locDef.exits.find(ex => ex.to === 'treasure_room')) { // Check if exit already exists
                    locDef.exits.push({direction: 'north nook', to: 'treasure_room'});
                }
                return "The old key fits the lock! With a click, the chest opens. It seems to reveal a small, hidden nook behind it!";
            }
            if (itemInInventory.id === 'crystal_key' && targetNameInput.includes('niche') && currentLocId === 'sunstone_antechamber') {
                 if (gs.flags.crystalKeyPlacedInNiche) return "The Crystal Key is already in the niche.";
                 rfp('crystal_key');
                 ugs({ flags: { ...gs.flags, crystalKeyPlacedInNiche: true }});
                 if (gs.flags.gearPlacedInMechanism && gs.flags.leverPlacedInMechanism) {
                     ugs({ flags: { ...gs.flags, antechamberMechanismActivated: true }});
                     return "You place the Crystal Key into the niche. It glows brightly, and with the gear and lever also in place, the entire mechanism shudders and the great door to the north rumbles open!";
                 }
                 return "You place the Crystal Key into the niche. It glows, waiting for other components.";
            }
             if (itemInInventory.id === 'ancient_gear' && targetNameInput.includes('mechanism') && currentLocId === 'sunstone_antechamber') {
                 if (gs.flags.gearPlacedInMechanism) return "A gear is already in the mechanism.";
                 rfp('ancient_gear');
                 ugs({ flags: { ...gs.flags, gearPlacedInMechanism: true }});
                 if (gs.flags.leverPlacedInMechanism && gs.flags.crystalKeyPlacedInNiche) {
                     ugs({ flags: { ...gs.flags, antechamberMechanismActivated: true }});
                     return "You fit the Ancient Gear into the mechanism. With the lever and key also in place, it activates, opening the great door to the north!";
                 }
                 return "You fit the Ancient Gear into the mechanism. It clicks satisfyingly.";
            }
             if (itemInInventory.id === 'rusty_lever' && targetNameInput.includes('mechanism') && currentLocId === 'sunstone_antechamber') {
                 if (gs.flags.leverPlacedInMechanism) return "A lever is already in the mechanism.";
                 rfp('rusty_lever');
                 ugs({ flags: { ...gs.flags, leverPlacedInMechanism: true }});
                  if (gs.flags.gearPlacedInMechanism && gs.flags.crystalKeyPlacedInNiche) {
                     ugs({ flags: { ...gs.flags, antechamberMechanismActivated: true }});
                     return "You insert the Rusty Lever into the mechanism. With the gear and key also in place, it activates, opening the great door to the north!";
                 }
                 return "You insert the Rusty Lever into its socket in the mechanism.";
            }
             if (itemInInventory.id === 'crystal_key' && (targetNameInput.includes('wall') || targetNameInput.includes('passage')) && currentLocId === 'crystal_chamber' && !gs.flags.crystalKeyUsed) {
                rfp('crystal_key'); 
                ugs({ flags: { ...gs.flags, crystalKeyUsed: true } });
                return "You touch the Crystal Key to the strange section of the north wall. It glows intensely, and a hidden passage grinds open, revealing the entrance to the Ancient Catacombs!";
            }
        }
        
        if (itemInInventory.onUse) {
            // Pass targetNameInput to onUse, it can decide if it's relevant
            return itemInInventory.onUse(gs, ugs, ail, rfp, targetNameInput);
        }

        return `You can't use the ${itemInInventory.name} ${targetNameInput ? `on "${targetNameInput}"` : 'like that here'}.`;
    },
    eat: (args, gs, ugs, ail, rfp) => {
        const requestedItemName = args.join(' ').trim();
        if (!requestedItemName) return "Eat what?";

        const itemToEat = findItemByName(requestedItemName, gs.player.inventory, ITEMS);
        if (!itemToEat) return `You don't have "${requestedItemName}" to eat.`;
        if (!itemToEat.isFood || !itemToEat.energyRestored) return `You can't eat the ${itemToEat.name}.`;

        rfp(itemToEat.id);
        ugs({}, itemToEat.energyRestored); 
        addMessage(`You eat the ${itemToEat.name}. You feel somewhat revitalized. (+${itemToEat.energyRestored} energy)`, 'energy');
        return ""; 
    },
    help: () => {
      return `Available commands:
      GO [direction] - Move in a direction (e.g., 'go north').
      LOOK - Describe your surroundings.
      LOOK AT [object/item/feature] - Examine something more closely.
      TAKE [item] - Pick up an item.
      DROP [item] - Drop an item from your inventory.
      USE [item] - Use an item (e.g., 'use torch').
      USE [item] ON [target] - Use an item on something (e.g., 'use rope on chasm', 'use key on chest').
      EAT [food item] - Consume a food item to regain energy.
      INVENTORY / I - Check what you are carrying.
      HELP - Show this help message.
      You might also try typing answers to riddles directly (e.g., 'map'), or using 'open box'.`;
    },
  };
  
  const processCommand = (input: string) => {
    if (gameState.gameOver && !gameState.gameWon) {
      addMessage("The game is over. Refresh to play again.", 'error');
      return;
    }
    if (gameState.gameWon) {
      addMessage("You have already won! Refresh to play again.", 'success');
      return;
    }

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    addMessage(`> ${input}`, 'info'); 

    const [commandWord, ...args] = trimmedInput.split(/\s+/);
    const command = commandWord.toLowerCase();
    let message = `Unknown command: "${command}". Type 'help' for commands.`;

    const currentLocationDef = LOCATIONS[gameState.player.currentLocationId];
    if (currentLocationDef.onCommand) {
        const locationResult = currentLocationDef.onCommand(
            command, args, gameState, updateGameState, 
            addItemToLocation, removeItemFromPlayer, addItemToPlayer
        );
        if (typeof locationResult === 'string') {
            addMessage(locationResult, 'success');
            if (gameState.player.energy <= 0 && !gameState.gameOver && !gameState.gameWon) {
                setGameState(prev => ({...prev, gameOver: true, gameWon: false})); // Directly set game over
            }
            return;
        }
    }
    
    if (commandHandlers[command]) {
      message = commandHandlers[command](args, gameState, updateGameState, addItemToLocation, removeItemFromPlayer, addItemToPlayer, removeItemFromLocation);
    } else if (command === 'i') { 
      message = commandHandlers.inventory(args, gameState, updateGameState, addItemToLocation, removeItemFromPlayer, addItemToPlayer, removeItemFromLocation);
    }
    
    if(message) addMessage(message, message.startsWith("You can't") || message.startsWith("Unknown") || message.startsWith("There is no") || message.startsWith("Go where") || message.startsWith("You are too exhausted") ? 'error' : 'info');
    
     if (gameState.player.energy <= 0 && !gameState.gameOver && !gameState.gameWon) {
        setGameState(prev => ({...prev, gameOver: true, gameWon: false}));
    }
  };
  
  const previousEnergyRef = useRef<number>(gameState.player.energy);
  useEffect(() => {
      if (previousEnergyRef.current > 0 && gameState.player.energy <= 0 && !gameState.gameOver && !gameState.gameWon) {
          // This state update will trigger a re-render, and the game over message will be shown by the JSX.
          // Ensure addMessage isn't called here if updateGameState handles setting gameOver, to avoid double messages.
          // The JSX for gameOver && !gameWon will display the primary game over message.
          // Let's add a specific exhaustion message if not already covered by a win/loss condition message.
          if (!gameState.gameWon) { // only show if not already won
             addMessage("You have collapsed from exhaustion... The darkness consumes you. GAME OVER.", 'error');
          }
      }
      previousEnergyRef.current = gameState.player.energy;
  }, [gameState.player.energy, gameState.gameOver, gameState.gameWon, addMessage]);


  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-100 font-mono">
      <Header title="Crystal Cave Adventure" />
      <StatusBar energy={gameState.player.energy} maxEnergy={gameState.player.maxEnergy} />
      <LocationImage imageUrl={LOCATIONS[gameState.player.currentLocationId]?.image || ''} altText={LOCATIONS[gameState.player.currentLocationId]?.name || 'Current Location'} />
      <MessageLog messages={gameState.messages} />
      {!gameState.gameOver && !gameState.gameWon && <CommandInput onCommand={processCommand} />}
      {gameState.gameWon && ( // Only show win message if gameWon is true
        <div className="p-4 text-center text-2xl font-bold text-green-400 bg-gray-900">
          CONGRATULATIONS! YOU'VE FOUND THE SUNSTONE AND WON THE GAME!
        </div>
      )}
       {gameState.gameOver && !gameState.gameWon && ( // Only show game over if gameOver and not won
        <div className="p-4 text-center text-2xl font-bold text-red-400 bg-gray-900">
          GAME OVER. Your quest ends here. Refresh to try again.
        </div>
      )}
    </div>
  );
};

export default App;
