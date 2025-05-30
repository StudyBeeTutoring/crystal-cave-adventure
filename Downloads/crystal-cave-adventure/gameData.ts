
import { LocationDefinition, Item } from './types';

export const ITEMS: Record<string, Item> = {
  torch: {
    id: 'torch',
    name: 'Torch',
    description: 'A sturdy wooden torch. It seems unlit, but has a flint striker attached.',
    descriptionInRoom: 'A rusty torch lies on the ground.',
    canTake: true,
    onUse: (gameState, updateGameState) => {
      if (gameState.flags.torchLit) {
        return "The torch is already burning brightly.";
      }
      updateGameState({ flags: { ...gameState.flags, torchLit: true } });
      return "You strike the flint, and the torch head catches, casting a flickering light!";
    },
  },
  rope: {
    id: 'rope',
    name: 'Coil of Rope',
    description: 'A long, sturdy coil of rope. It looks strong enough to support weight and could be useful for climbing or bridging gaps.',
    descriptionInRoom: 'A coil of sturdy rope is neatly placed near an edge.',
    canTake: true,
  },
  old_key: {
    id: 'old_key',
    name: 'Old Key',
    description: 'A tarnished, old-fashioned key. It feels heavy and important, likely for an old lock.',
    descriptionInRoom: 'A small, old key rests on a dusty ledge.',
    canTake: true,
  },
  sunstone: {
    id: 'sunstone',
    name: 'Sunstone',
    description: 'The legendary Sunstone! It glows with a warm, inner light and feels powerful to the touch. Its discovery marks the end of your quest.',
    descriptionInRoom: 'The magnificent Sunstone rests on an ancient pedestal, pulsing with a warm, life-giving light.',
    canTake: true,
  },
  gold_coins: {
    id: 'gold_coins',
    name: 'Pouch of Gold Coins',
    description: 'A heavy pouch filled with ancient gold coins. A true treasure!',
    descriptionInRoom: 'A leather pouch, bulging with what looks like coins, glints in the dim light.',
    canTake: true,
  },
  jeweled_dagger: {
    id: 'jeweled_dagger',
    name: 'Jeweled Dagger',
    description: 'A finely crafted dagger with a hilt encrusted with sparkling gems. More a showpiece than a weapon.',
    descriptionInRoom: 'A beautiful jeweled dagger lies here, catching any available light.',
    canTake: true,
  },
  chest: {
    id: 'chest',
    name: 'Old Chest',
    description: 'A sturdy, locked old wooden chest. It seems very old and is bound with iron bands.',
    descriptionInRoom: 'An old, locked wooden chest sits in the corner. It looks like it needs a key.',
    canTake: false,
  },
  sturdy_boots: {
    id: 'sturdy_boots',
    name: 'Sturdy Boots',
    description: 'A pair of well-made leather boots with thick, gripping soles. They look like they would offer good traction.',
    descriptionInRoom: 'A pair of sturdy-looking boots are discarded near a pile of rocks.',
    canTake: true,
    onUse: () => "You're already wearing them if you took them. To equip, you'd just 'take' them. They provide passive benefits."
  },
  cave_jerky: {
    id: 'cave_jerky',
    name: 'Cave Jerky',
    description: 'Strips of dried, preserved meat. Smells a bit strange but looks edible.',
    descriptionInRoom: 'Some dried meat strips, likely cave jerky, are stashed here.',
    canTake: true,
    isFood: true,
    energyRestored: 35,
  },
  bioluminescent_fungus: {
    id: 'bioluminescent_fungus',
    name: 'Bioluminescent Fungus',
    description: 'A cluster of soft, glowing fungus. It emits a faint light and feels slightly damp.',
    descriptionInRoom: 'A patch of bioluminescent fungus grows on the damp wall, casting a faint glow.',
    canTake: true,
    isFood: true,
    energyRestored: 15,
  },
  rotting_log: {
    id: 'rotting_log',
    name: 'Rotting Log',
    description: 'A large, partially rotted log. It might be buoyant enough to serve as part of a makeshift raft if combined with something to tie it.',
    descriptionInRoom: 'A large, decaying log lies near the water\'s edge.',
    canTake: true, // Player takes it to "use" it for raft building
  },
  crystal_key: {
    id: 'crystal_key',
    name: 'Crystal Key',
    description: 'A key fashioned entirely from a single, flawless crystal. It hums with a faint energy.',
    descriptionInRoom: 'A radiant Crystal Key lies on a velvet cushion within a small, opened alcove.',
    canTake: true,
  },
  rusty_lever: {
    id: 'rusty_lever',
    name: 'Rusty Lever',
    description: 'A heavy iron lever, coated in rust but still solid. It looks like it could fit into a mechanism.',
    descriptionInRoom: 'A rusty lever is propped against a crumbling wall.',
    canTake: true,
  },
  ancient_gear: {
    id: 'ancient_gear',
    name: 'Ancient Gear',
    description: 'A precisely crafted gear made of an unknown, dark metal. It has intricate teeth and a central axle hole.',
    descriptionInRoom: 'An ancient-looking gear lies half-buried in the dust.',
    canTake: true,
  },
  journal_page_1: {
    id: 'journal_page_1',
    name: 'Journal Page 1',
    description: "A brittle page torn from a journal. It reads: '...the path diverged. One way, across the great chasm, leads to the Chamber of Echoes, where the Crystal Key was hidden. The other, down into the river's embrace, guards the ancient workings... Both are vital if the Antechamber's guardians are to be bypassed.'",
    descriptionInRoom: 'A torn piece of parchment lies on the ground.',
    canTake: true,
  },
  journal_page_2: {
    id: 'journal_page_2',
    name: 'Journal Page 2',
    description: "Another page: '...the Antechamber mechanism requires the Great Gear from the old guard's post by the river, and the Lever of Command. The Crystal Key too, for the final ward. Only then will the path to the Sunstone itself be revealed. Energy wanes... must find sustenance.'",
    descriptionInRoom: 'A fragile sheet of parchment is tucked into a crevice.',
    canTake: true,
  },
   ancient_tablet: {
    id: 'ancient_tablet',
    name: 'Ancient Tablet',
    description: 'A heavy stone tablet covered in intricate, unreadable symbols. It feels ancient and significant, a relic of a forgotten time.',
    descriptionInRoom: 'An ancient stone tablet rests on a broken pedestal.',
    canTake: true,
  },
};

export const LOCATIONS: Record<string, LocationDefinition> = {
  cave_entrance: {
    id: 'cave_entrance',
    name: 'Cave Entrance',
    image: 'https://picsum.photos/seed/cave_entry_wider/800/300',
    baseDescription: 'You stand at the yawning mouth of a dark cave. A chilling breeze whispers from within, carrying the scent of damp earth and ancient stone. The air feels heavy with untold stories. The only way forward is north, into the oppressive darkness. You spot a pair of discarded boots nearby.',
    initialItems: ['sturdy_boots'],
    exits: [{ direction: 'north', to: 'dark_passage' }],
  },
  dark_passage: {
    id: 'dark_passage',
    name: 'Dark Passage',
    image: 'https://picsum.photos/seed/dark_passage_torch_v2/800/300',
    baseDescription: 'The passage is narrow and suffocatingly dark. Water drips rhythmically from the unseen ceiling. Without a light source, you can barely discern your surroundings. With a light, you see paths leading north and east, and the way back south.',
    initialItems: ['torch'],
    exits: [
      { direction: 'south', to: 'cave_entrance' },
      { 
        direction: 'north', 
        to: 'chasm_edge', 
        requiredFlag: 'torchLit',
        conditionNotMetMessage: "It's too dark to proceed north safely. You need a light source."
      },
      {
        direction: 'east',
        to: 'cobwebbed_tunnel',
        requiredFlag: 'torchLit',
        conditionNotMetMessage: "A dense wall of cobwebs blocks the way east. It's too dark to see if anything lurks within."
      }
    ],
  },
  cobwebbed_tunnel: {
    id: 'cobwebbed_tunnel',
    name: 'Cobwebbed Tunnel',
    image: 'https://picsum.photos/seed/spider_webs_tunnel/800/300',
    baseDescription: 'Thick, sticky cobwebs fill this tunnel, brushing against your face and clinging to your clothes. It\'s difficult to move. You can push east or return west.',
    initialItems: [],
    exits: [
        { direction: 'west', to: 'dark_passage' },
        { direction: 'east', to: 'spider_chamber' }
    ],
    onEnter: (gameState, updateGameState) => {
        if (!gameState.flags.torchLit) {
            const newEnergy = gameState.player.energy - 5;
            updateGameState({ player: { ...gameState.player, energy: newEnergy }});
            return "Stumbling through the dark webs is unnerving and tiring (-5 energy).";
        }
        return "Your torchlight helps you navigate the webs, but they are still a nuisance.";
    }
  },
  spider_chamber: {
    id: 'spider_chamber',
    name: 'Spider Chamber',
    image: 'https://picsum.photos/seed/giant_spider_lair/800/300',
    baseDescription: 'This chamber is unnervingly quiet. Huge, dusty webs hang like macabre decorations. In the center, a massive, dormant spider rests. Best not to disturb it. You see some discarded adventurer\'s supplies in a corner.',
    initialItems: ['cave_jerky', 'ancient_tablet'], // Ancient Tablet as minor treasure
    exits: [{ direction: 'west', to: 'cobwebbed_tunnel' }],
  },
  chasm_edge: {
    id: 'chasm_edge',
    name: 'Edge of a Chasm',
    image: 'https://picsum.photos/seed/chasm_view_v2/800/300',
    baseDescription: 'Your light reveals you are standing on the precipice of a wide, deep chasm. The bottom is lost in shadow. Across the chasm (north), you think you see a faint glimmer. The passage continues south. A small alcove is visible to the east. To the west, a slippery-looking passage slopes downwards.',
    initialItems: ['rope', 'bioluminescent_fungus'],
    exits: [
      { direction: 'south', to: 'dark_passage' },
      { direction: 'east', to: 'alcove' },
      { 
        direction: 'north', 
        to: 'crystal_chamber_approach',
        requiredFlag: 'chasmBridged',
        conditionNotMetMessage: "The chasm is too wide to jump. You need a way to cross. Perhaps that rope could be used?"
      },
      {
        direction: 'west', // new exit
        to: 'slippery_passage',
        conditionNotMetMessage: "The passage west slopes down steeply and looks very slippery."
      }
    ],
  },
  slippery_passage: {
    id: 'slippery_passage',
    name: 'Slippery Passage',
    image: 'https://picsum.photos/seed/ice_slope_cave/800/300',
    baseDescription: 'This narrow passage slopes steeply downwards. The rock is slick with moisture and loose gravel. It looks treacherous.',
    initialItems: [],
    exits: [
        { direction: 'east', to: 'chasm_edge'},
        { direction: 'down', to: 'underground_river_access'}
    ],
    onEnter: (gameState, updateGameState) => {
        if (!gameState.player.inventory.includes('sturdy_boots') && !gameState.flags.bootsWarned) {
             updateGameState({ flags: {...gameState.flags, bootsWarned: true}}); // Prevent spamming message
            const newEnergy = gameState.player.energy - 10;
            updateGameState({ player: { ...gameState.player, energy: newEnergy }});
            return "You stumble and slide, losing your footing! This is tiring without proper footwear (-10 energy).";
        } else if (gameState.player.inventory.includes('sturdy_boots')) {
            return "Your sturdy boots provide excellent grip on the slippery surface.";
        }
        return "";
    }
  },
  underground_river_access: {
    id: 'underground_river_access',
    name: 'Underground River Access',
    image: 'https://picsum.photos/seed/cave_river_bank/800/300',
    baseDescription: 'The passage opens into a vast cavern. A wide, dark river flows swiftly from east to west. The air is cool and damp. You see a large, rotting log near the bank. The only way back is up the slippery passage.',
    initialItems: ['rotting_log'],
    exits: [
        { direction: 'up', to: 'slippery_passage'},
        { 
            direction: 'cross river', 
            to: 'far_river_bank',
            requiredFlag: 'raftBuilt',
            conditionNotMetMessage: "The river is too swift and wide to swim. You need some kind of raft."
        }
    ],
  },
  far_river_bank: {
    id: 'far_river_bank',
    name: 'Far River Bank',
    image: 'https://picsum.photos/seed/river_other_side/800/300',
    baseDescription: 'You\'ve made it to the other side of the river. The current looks strong here. A narrow path leads north into more darkness. You can attempt to cross back on your raft.',
    initialItems: [],
    exits: [
        { direction: 'cross river', to: 'underground_river_access', requiredFlag: 'raftBuilt', conditionNotMetMessage: "Your raft is on the other side."}, // Assuming raft stays
        { direction: 'north', to: 'ruined_guardroom'}
    ]
  },
  ruined_guardroom: {
    id: 'ruined_guardroom',
    name: 'Ruined Guardroom',
    image: 'https://picsum.photos/seed/cave_ruins_guard/800/300',
    baseDescription: 'This chamber looks like it was once a guard post. Old, rusted armor fragments and broken weapons litter the floor. There is a heavy, rusty lever propped against a wall and what might be an ancient gear half-buried in dust. A tattered journal page lies on a stone table.',
    initialItems: ['rusty_lever', 'ancient_gear', 'journal_page_2'],
    exits: [{direction: 'south', to: 'far_river_bank'}]
  },
  alcove: {
    id: 'alcove',
    name: 'Damp Alcove',
    image: 'https://picsum.photos/seed/riddle_alcove_v2/800/300',
    baseDescription: "This small alcove is damp and cool. Moss clings to the wet stone walls. Carved into the far wall is a peculiar riddle: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?'",
    initialItems: ['bioluminescent_fungus'], // Added some food
    exits: [{ direction: 'west', to: 'chasm_edge' }],
    onCommand: (command, args, gameState, updateGameState, addItemToLocation) => {
      const answer = args.join(" ").toLowerCase();
      if (command === 'map' || answer === 'map') { // Allow direct answer as command
        if (!gameState.flags.riddleSolved) {
            updateGameState({ flags: { ...gameState.flags, riddleSolved: true } });
            addItemToLocation('old_key', 'alcove');
            return "With a soft click, a small stone panel slides open in the wall, revealing an old key!";
        }
         return "You've already solved this riddle.";
      }
      return false;
    },
  },
  crystal_chamber_approach: { 
    id: 'crystal_chamber_approach',
    name: 'Chasm Crossing',
    image: 'https://picsum.photos/seed/rope_bridge_cave_v2/800/300',
    baseDescription: 'You carefully make your way across the makeshift rope bridge, the chasm yawning beneath you. The air grows warmer, and a faint glimmer from ahead intensifies. The path continues north.',
    initialItems: [],
    exits: [
      { direction: 'south', to: 'chasm_edge' }, // No taking rope back for now
      { direction: 'north', to: 'crystal_chamber'}
    ],
  },
  crystal_chamber: {
    id: 'crystal_chamber',
    name: 'Crystal Chamber (Chamber of Echoes)',
    image: 'https://picsum.photos/seed/glowing_crystals_key/800/300',
    baseDescription: 'You step into a breathtaking cavern. Countless crystals embedded in the walls and ceiling emit a soft, ethereal glow, illuminating the vast space. This must be the Chamber of Echoes mentioned in legends. On a simple stone pedestal is a small, ornate box. A path leads west to a room with a heavy door. Another passage goes south, back across the chasm crossing.',
    initialItems: [], // Crystal Key is inside the box
    features: [{id: 'pedestal_box', name: 'Ornate Box', description: 'A small, intricately carved wooden box on the pedestal. It appears to be unlocked.', isInteractable: true}],
    exits: [
      { direction: 'south', to: 'crystal_chamber_approach' },
      { direction: 'west', to: 'locked_door_room' },
      { 
        direction: 'north', 
        to: 'ancient_catacombs_entry',
        requiredFlag: 'crystalKeyUsed',
        conditionNotMetMessage: "A section of the north wall looks different, but there's no obvious way through."
      }
    ],
    onCommand: (command, args, gameState, updateGameState, addItemToLocation) => {
        if (command === 'open' && args.join(' ').toLowerCase().includes('box')) {
            if (!gameState.flags.crystalBoxOpened) {
                updateGameState({ flags: { ...gameState.flags, crystalBoxOpened: true } });
                addItemToLocation('crystal_key', 'crystal_chamber');
                addItemToLocation('journal_page_1', 'crystal_chamber'); // Journal page with the key
                return "You open the ornate box. Inside, resting on velvet, are a shimmering Crystal Key and a folded Journal Page!";
            }
            return "The box is already open.";
        }
        return false;
    }
  },
  locked_door_room: {
    id: 'locked_door_room',
    name: 'Room with Locked Chest',
    image: 'https://picsum.photos/seed/ancient_locked_chest/800/300',
    baseDescription: 'This small, dusty chamber is dominated by an old, sturdy wooden chest in one corner. It appears to be securely locked. The way out is east to the Crystal Chamber.',
    initialItems: ['chest'], 
    exits: [{ direction: 'east', to: 'crystal_chamber' }],
    // Note: using 'old_key' on 'chest' will be handled by general 'use' command.
    // If chest is unlocked, items 'gold_coins', 'jeweled_dagger' are added to this room.
  },
  ancient_catacombs_entry: {
    id: 'ancient_catacombs_entry',
    name: 'Ancient Catacombs Entry',
    image: 'https://picsum.photos/seed/catacombs_entrance/800/300',
    baseDescription: 'The Crystal Key opened a hidden passage! You are at the entrance to a series of dark, winding catacombs. The air is stale and heavy. Passages lead deeper north and east. The way back south leads to the Crystal Chamber.',
    initialItems: [],
    exits: [
        { direction: 'south', to: 'crystal_chamber'},
        { direction: 'north', to: 'catacombs_passage_1'},
        { direction: 'east', to: 'catacombs_passage_2'}
    ]
  },
  catacombs_passage_1: {
    id: 'catacombs_passage_1',
    name: 'Catacombs Passage',
    image: 'https://picsum.photos/seed/catacombs_narrow/800/300',
    baseDescription: 'A narrow, dusty passage. It winds onwards to the west. You can return south.',
    initialItems: ['bioluminescent_fungus'],
    exits: [
        { direction: 'south', to: 'ancient_catacombs_entry'},
        { direction: 'west', to: 'catacombs_junction'}
    ]
  },
  catacombs_passage_2: {
    id: 'catacombs_passage_2',
    name: 'Catacombs Dead End',
    image: 'https://picsum.photos/seed/catacombs_end/800/300',
    baseDescription: 'This passage ends in a rockfall. It seems there was once something here, but it is now inaccessible. You see some more edible fungus.',
    initialItems: ['bioluminescent_fungus'],
    exits: [ {direction: 'west', to: 'ancient_catacombs_entry'} ]
  },
  catacombs_junction: {
    id: 'catacombs_junction',
    name: 'Catacombs Junction',
    image: 'https://picsum.photos/seed/catacombs_crossroad/800/300',
    baseDescription: 'This small chamber serves as a junction. Passages lead east (back the way you came) and north, deeper into the catacombs.',
    initialItems: [],
    exits: [
        {direction: 'east', to: 'catacombs_passage_1'},
        {direction: 'north', to: 'sunstone_antechamber'}
    ]
  },
  sunstone_antechamber: {
    id: 'sunstone_antechamber',
    name: 'Sunstone Antechamber',
    image: 'https://picsum.photos/seed/antechamber_mechanism/800/300',
    baseDescription: 'You enter a grand antechamber. A massive stone door blocks the way north. In the center of the room is a complex mechanism with slots for a gear and a lever. There\'s also a small, crystal-lined niche that looks like it might fit a special key.',
    initialItems: [],
    features: [
        {id: 'mechanism', name: 'Mechanism', description: 'A large stone mechanism with a slot for a gear and a socket for a lever.', isInteractable: true},
        {id: 'niche', name: 'Crystal Niche', description: 'A small niche lined with pulsating crystals. It seems to require a key of similar material.', isInteractable: true}
    ],
    exits: [
        {direction: 'south', to: 'catacombs_junction'},
        {
            direction: 'north', 
            to: 'sunstone_sanctuary',
            requiredFlag: 'antechamberMechanismActivated',
            conditionNotMetMessage: 'The massive stone door to the north is sealed. The mechanism in the room looks incomplete.'
        }
    ]
  },
  sunstone_sanctuary: {
    id: 'sunstone_sanctuary',
    name: 'Sunstone Sanctuary',
    image: 'https://picsum.photos/seed/sunstone_final_room/800/300',
    baseDescription: 'You\'ve made it! This sacred chamber glows with an intense, warm light. In the center, upon an ancient pedestal, rests the legendary Sunstone, its brilliance filling the room with hope and power. This is the object of your long quest.',
    initialItems: ['sunstone'],
    exits: [] // No exits, game won by taking Sunstone
  },
   treasure_room: { // Unchanged, still accessible from locked_door_room via chest
    id: 'treasure_room',
    name: 'Hidden Treasure Nook',
    image: 'https://picsum.photos/seed/cave_treasure_gold_v2/800/300',
    baseDescription: 'The old chest creaked open to reveal this small, hidden nook! Piles of glittering gold coins and a magnificent jeweled dagger lie within. A true adventurer\'s reward!',
    initialItems: ['gold_coins', 'jeweled_dagger'],
    exits: [{ direction: 'south', to: 'locked_door_room' }], 
  }
};
