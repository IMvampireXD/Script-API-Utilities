<p align="center">
<img src="/.github/assets/banner.png" alt="" height="325">
</p>

---

# Minecraft Bedrock Script API Utilities

A library of useful functions for simplifying development with Minecraft Bedrock's Script API.

## List of functions:

### Inventory-Utils.js:

| Function       | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| getInventory   | Get a player's inventory container easily                                         |
| clearInventory | Clears player's inventory.                                                        |
| hasItem        | Checks if the player has a specified quantity of a certain item in his inventory. |
| addItem        | Adds an item to player's inventory                                                |
| removeItem     | Removes a specific amount of items from the player's inventory.                   |
| saveInventory  | Save the player's full inventory into a dynamic property.                         |
| loadInventory  | Load the saved inventory                                                          |

### Block-Utils.js:

| Function                    | Description                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------- |
| getNearbyBlocks             | Gets adjacent blocks connected to the current block.                                |
| placeBlockAboveWater        | Function to place a block directly above water, replicating behaviour of lily pads. |
| getRedstonePower            | Gets redstone power of the block.                                                   |
| replaceBlocksInArea         | Replaces blocks of a specefic type in an area.                                      |
| replaceBlocksFromStartBlock | Replaces blocks from start block with a specified Width, Height, Depth.             |
| cancelBlockBreaking         | Cancel the breaking of the specefic block.                                          |
| cancelBlockPlacing          | Cancel the placing of the specefic block.                                           |

---

### Entity-Utils.js:

| Function             | Description                                                                          |
| -------------------- | ------------------------------------------------------------------------------------ |
| isPlayer             | Checks if the entity is player or not.                                               |
| getCardinalDirection | Gets the cardinal direction of an Entity - "up"/"down"/"north"/"east"/"south"/"west" |
| isUnderground        | Function to return boolean whether the player is underground or not.                 |
| isPlayerOnSurface    | Function to return boolean whether the player is on surface or not.                  |
| moveToLocation       | Moves the entity to specified location using applyKnockback or applyImpulse          |
| shootProjectile      | Shoots a projectile from a entity's view direction.                                  |
| getEntityHitboxSize  | Gets entity hitbox size                                                              |

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

| Function             | Description                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cloneItemStackInfo   | Copies all relevant data from one itemStack to another.                                                                                                   |
| createItemStack      | Creates a custom ItemStack with additional data (nameTag, lore, enchantments, and durability)                                                             |
| clearAllEnchantments | Removes all enchantments from an item                                                                                                                     |
| serializeItemStack   | Serializes an itemStack allowing the ItemStack being able to be saved in dynamic property.                                                                |
| deserializeItemStack | Deserializes and retrieves an itemStack from storage data.                                                                                                |
| getEnchantments      | Extracts enchantments from an item as an object.                                                                                                          |
| applyEnchantments    | Adds enchantment to an item.                                                                                                                              |
| transferEnchantments | Transfer enchantments from an item to another.                                                                                                            |
| isBlock              | Check if ItemStack is a block. For example, minecraft:stone is a block, but minecraft:iron_shovel isn't.                                                  |
| getWearableSlot      | Retrieve the EquipmentSlot that this ItemStack can be worn into. For example, an iron chestplate will return "Chest", a totem of undying return "Offhand" |
| getStoredItems       | Get the item contents of an Item. For example, items inside a shulkerbox and bundles                                                                      |

---

### Dimension-Utils.js:

| Function    | Description                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| runCommands | Run multiple commands at once.                                                                     |
| spawnItem   | Spawn an item in a location.                                                                       |
| getBlock    | Gets a block from any dimension & location in world asynchronously (Even if the chunk is unloaded) |
| getBiome    | Get the approximate biome on a location. ( Underground biomes are supported. )                     |

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
