# Minecraft Bedrock Script API Utilities

A collection of utility modules to simplify development with Minecraft Bedrock's Script API.

## Modules

### Blocks
**BlockHelper.js**
- `breakBlocks(startBlock, width, height, depth)` - Breaks blocks in a 3D area
- `placeBlockAboveWater(blockType)` - Places blocks on water surfaces
~~
**BlockEvents.js**
- `onBlockBreak(callback)` - Event for block breaks
- `onBlockPlace(callback)` - Event for block placement
~~

### Entities
**EntityHelper.js**
- `getCardinalDirection(entity)` - Returns compass direction
- ~~ `move(entity, location)` - Moves entity smoothly~~
- `isUnderground(entity)` - Checks underground status
- `getPlayerDevice(player)` - Detects player's platform

### Items
**InventoryHelper.js**
- `saveInventory(player)` - Saves inventory state
- `loadInventory(player)` - Restores inventory

**ItemStackHelper.js**
- `transferEnchantments(sourceItem, destinationItem)` - Transfers enchantments across items.
- `spawnItem(item, location)` - Spawns items in world

### Math
**MathUtils.js**
- `class Random` - Set of useful random functions (int, float, range, chance, get, weighted).
- `class NumberRange` - Represents a numeric range with a minimum and maximum value.

**Vector3Utils.js**
- Vector math operations and utilities

### String
**StringUtils.js**
- `toTypeIdFormat(string)` - Converts to typeID format
- `toDisplayName(string)` - Formats for display
- `generateRandom(length)` - Generates random strings

### World
**DimensionHelper.js**
- `getPlayerByName(name)` - Finds player by name
- `getEntitiesInRadius(location, radius)` - Area queries

### Core Utilities
**EventUtils.js**
- Custom event system and handlers

**MiscUtils.js**
- Various helper functions

## Usage

```js
import { Random } from './math/MathUtils';
import { isUnderground } from './entities/EntityHelper';

// Generate random number
const random = Random.int(1, 10);

// Check if player is underground
if (isUnderground(player)) {
// ...
}
```

## Installation

1. Clone or download the utilities folder
2. Import required modules in your scripts
3. See individual module files for detailed documentation

## Contributing

Pull requests and issue reports are welcome. Maintain consistent style with existing code.