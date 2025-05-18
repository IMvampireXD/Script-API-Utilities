<p align="center">
<img src="/.github/assets/banner.png" alt="" height="325">
</p>

---

# Minecraft Bedrock Script API Utilities

A library of useful functions for simplifying development with Minecraft Bedrock's Script API.

## List of functions:

### Block-Utils.js:

| Function                  | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| cancelBlockBreaking       | Cancel the breaking of the specefic block.                                          |
| breakBlocksFromStartBlock | Breaks block from a starting block with provided width, height and depth            |
| placeBlockAboveWater      | Function to place a block directly above water, replicating behaviour of lily pads. |

---

### Entity-Utils.js:

| Function                | Description                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------ |
| getCardinalDirection    | Gets the cardinal direction of an Entity - "up"/"down"/"north"/"east"/"south"/"west" |
| isUnderground           | Function to return boolean whether the player is underground or not.                 |
| isPlayerOnSurface       | Function to return boolean whether the player is on surface or not.                  |
| moveToLocation          | Moves the entity to specified location using applyKnockback or applyImpulse          |
| getDevice               | Gets the platform/device the player is using.                                        |
| detectPlayerShootsEvent | Detects when a player shoots a projectile that hits another entity.                  |
| detectDoubleJumpEvent   | Detects when a player does a double jump.                                            |
| isRidingEntity          | Checks if a player is riding a specific entity type.                                 |
| isCreative              | Checks if player is in creative.                                                     |
| isSurvival              | Checks if the player is in survival.                                                 |
| isPlayer                | Checks if the entity is player or not.                                               |
| detectItemDrop          | Fires an event if the player has dropped an item.                                    |
| detectPickingUpItem     | Fires an event if the player has picked up an item.                                  |

---

### Math-Utils.js:

| Function        | Description                                 |
| --------------- | ------------------------------------------- |
| getRandomNumber | Returns a random number between min and max |

---

### Custom-Events.js:

| Function        | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| onItemPickup    | Detects when player picks up any item.                              |
| onItemDrop      | Detects when player drops any item.                                 |
| onProjectileHit | Detects when a player shoots a projectile that hits another entity. |
| onDoubleJump    | Detects when a player does a double jump.                           |

---
### ItemStack-Utils.js:

| Function             | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| saveInventory        | Saves everything of Inventory into a dynamic property.                                         |
| loadInventory        | Load the saved inventory.                                                                      |
| addEnchantment       | Adds enchantment to an item.                                                                   |
| transferEnchantments | Transfer enchantments from an item to another.                                                 |
| spawnItem            | Spawn an item in a location.                                                                   |
| isHavingItemQuantity | Returns true if the player has the specified amount of item in the inventory. Otherwise false. |

---

### Dimension-Utils.js:

| Function             | Description                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| runCommands          | Run multiple commands at once.                                                                      |
| spawnItem            | Spawn an item in a location.                                                                        |
| getBlock             | Gets a block from any dimension & location in world asynchronously (Even if the chunk is unloaded)  |
| getBiome             | Get the approximate biome on a location. ( Underground biomes are supported. )                      |


# Usage Example

```js
import { Random } from "./utilities/math-utilities.js";
import { InventoryUtils } from "./utilities/inventory-utilities.js";
import { DimensionUtils } from "./utilities/dimension-utilities.js";
import { CustomEvents } from "./utilities/custom-events.js";
import { EntityUtils } from "./utilities/entity-utilities.js";

// Returns random number between 1 and 5.
console.warn(Random.int(1, 5));

// Get the player "Steve" by name, easily by using the library.
const player = DimensionUtils.getPlayerByName("Steve");

// Check if the player is in Survival, easily by using the library.
if (EntityUtils.isSurvival(player)) {
  // Save the Inventory of the player, easily by using the library.
  InventoryUtils.saveInventory(player);
}

// Check if a player has dropped a Item, easily by using the library.
CustomEvents.detectPlayerDropItem((event) => {
  world.sendMessage(` ${item.typeId} was dropped by ${player.name} !`);
});
```

# Installation
1. Clone or download the utilities folder.
2. Import required functions in your scripts, as your need.

# Contributing
Pull requests and issue reports are welcome. Maintain consistent style with existing code.
