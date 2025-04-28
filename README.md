<p align="center">
<img src="/.github/assets/banner.png" alt="" height="325">
</p>

---

# Minecraft Bedrock Script API Utilities

A library of useful functions for helping with creating scripts in Minecraft Bedrock to make Script API **easier.**

## 📁 List of functions:

### block-utilities.js:

| Function                  | Description                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------- |
| breakBlocksFromStartBlock | Breaks block from a starting block with provided width, height and depth            |
| placeBlockAboveWater      | Function to place a block directly above water, replicating behaviour of lily pads. |

---

### entity-utilities.js:

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

### math-utilities.js:

| Function        | Description                                 |
| --------------- | ------------------------------------------- |
| getRandomNumber | Returns a random number between min and max |

---

### ItemStack-utilities.js:

| Function             | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| saveInventory        | Saves everything of Inventory into a dynamic property.                                         |
| loadInventory        | Load the saved inventory.                                                                      |
| addEnchantment       | Adds enchantment to an item.                                                                   |
| transferEnchantments | Transfer enchantments from an item to another.                                                 |
| spawnItem            | Spawn an item in a location.                                                                   |
| isHavingItemQuantity | Returns true if the player has the specified amount of item in the inventory. Otherwise false. |

---

# Usage Example

Download the utlities folder.
And import the functions as your need, in your script, Example:

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
