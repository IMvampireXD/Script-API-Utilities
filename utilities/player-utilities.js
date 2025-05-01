import { GameMode, Player } from "@minecraft/server";

export class PlayerUtils {
    /**
     * Gets the platform/device the player is using.
     * @author Vyse
     * @param {Player} player
     * @returns {string}
     * @example
     * import { world } from "@minecraft/server"
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
     * const player = world.getPlayers()[0];
     * PlayerUtils.getDevice(player);
    */
    static getDevice(player) {
        const { platformType, memoryTier, maxRenderDistance } = player.clientSystemInfo;
        if (maxRenderDistance < 6 || maxRenderDistance > 96 || platformType === null) return "Bot";
        if (platformType === "Desktop") return "Windows";
        if (platformType === "Mobile") {
      return maxRenderDistance > 16 ? "Android" : "iOS";
        }
        if (platformType === "Console") {
      if (memoryTier === 3 && maxRenderDistance === 12) return "Nintendo Switch";
      if (memoryTier === 4 && maxRenderDistance === 36) return "Xbox Series S";
      if (memoryTier === 5 && maxRenderDistance === 36) return "Xbox Series X";
      if (memoryTier === 4) {
        if (player.name.match(/[_-]/g) && maxRenderDistance === 16) return "PS4";
        if (maxRenderDistance === 16) return "Xbox One";
        if (maxRenderDistance === 18) return "PS4 Pro";
        if (maxRenderDistance === 28) return "PS5";
      }
        }
        return "Unknown Device";
    };


    /**
     * Function to return boolean whether the player is underground or not
     * checks if player is in underground
     * @author Serty
     * @param {Player} player The player to test if they are underground
     * @returns {boolean}
     * @example
     * import { world } from "@minecraft/server"
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
     * const player = world.getPlayers()[0];
     * PlayerUtils.isUnderground(player);
    */
    static isUnderground(player) {
        if (player.dimension.heightRange.min > player.location.y) return true;
        if (player.dimension.heightRange.max < player.location.y) return false;
    
        let block = player.dimension.getTopmostBlock(player.location)
        if (player.location.y >= block.y) return false
        while (!block.isSolid && block.y > player.dimension.heightRange.min) {
          if (player.location.y >= block.y) return false
          block = block.below()
        };
        return true
    };

    /**
     * @author Eon
     * @param {Player} player The player to test if they are on surface
     * @returns {boolean} 
     * @example
     * import { world } from "@minecraft/server"
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
     * const player = world.getPlayers()[0];
     * PlayerUtils.isPlayerOnSurface(player);
    */
    static isPlayerOnSurface(player) {
        const location = player.location;
        const blockBelow = player.dimension.getBlock(new Vec3(player.location.x, player.location.y, player.location.z).subtract({ x: 0, y: 1, z: 0 }));
        const blockAbove = player.dimension.getBlock(new Vec3(location.x, location.y, location.z).add({ x: 0, y: 1, z: 0 }));

        const isSolidGround = blockBelow && blockBelow.typeId !== "minecraft:air";
        const hasOpenSky = !blockAbove || blockAbove.typeId === "minecraft:air";

        if (isSolidGround && hasOpenSky) {
            for (let y = Math.ceil(location.y) + 1; y < 320; y++) {
                const block = player.dimension.getBlock(new Vec3(location.x, y, location.z));
                if (block && block.typeId !== "minecraft:air") {
                    return false;
                };
            };
            return true;
        };
        return false;
    };

    /**
     * Get the Cardinal direction of the player
     * @author GST378
     * @author finnafinest_
     * @param {Player} player The player to get the Cardinal direction of
     * @returns {"up"|"down"|"north"|"east"|"south"|"west"}
     */
    static getCardinalDirection(player) {
        const yaw = player.getRotation().y;
        const pitch = player.getRotation().x;
        if (pitch > 85) return 'down';
        if (pitch < -85) return 'up';
        if (yaw >= -45 && yaw < 45) return 'north';
        else if (yaw >= 45 && yaw < 135) return 'east';
        else if (yaw >= 135 || yaw < -135) return 'south';
        else return 'west';
    };

    /**
     * Checks if a player is riding a specific entity type.
     * @param {Player} player Player to check if riding an entity
     * @param {string} entityType Type ID of the entity to check, example: "minecraft:horse"
     * @returns {boolean}
     * @example
     * import { world } from "@minecraft/server"
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
     * const player = world.getPlayers()[0];
     * const isRidingPlayer = PlayerUtils.isRidingEntity(player, "minecraft:horse");
     * @throws If player is not a Player.
     * @throws if Player doesn't have a `riding` component
    */
    static isRidingEntity(player, entityType) {
        // Validate the player object
        if (!player || typeof player.getComponent !== 'function') {
            throw new Error('Invalid player object provided. Player must have a `getComponent` method.');
        }
        // Safely get the 'riding' component
        const riding = player.getComponent('riding');
        // Validate the riding component and entityRidingOn
        if (!riding) {
            throw new Error('Player does not have a `riding` component.');
        };
        if (!riding.entityRidingOn) {
            throw new Error('Player is not riding any entity.');
        };
        // Compare the typeId of the entity being ridden with the provided entityType
        return riding.entityRidingOn.typeId === entityType;
    };

    /**
     * Checks if the player has a specified quantity of a certain item in their inventory.
     *
     * @param {Player} player - The player whose inventory is being checked.
     * @param {string} typeId - The typeId of the item to check for.
     * @param {number} required - The required quantity of the item.
     * @returns {boolean} - Returns true if the player has at least the required quantity of the item, false otherwise.
     * @example
     * import { world } from "@minecraft/server";
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
     * const player = world.getPlayers()[0];
     * const hasDiamonds = PlayerUtils.isHavingItemQuantity(player, "minecraft:diamond", 5);
    */
    static isHavingItemQuantity(player, typeId, required) {
        const inventoryComponent = player.getComponent("inventory");
        const container = inventoryComponent.container;
        if (container === undefined) {
            return false;
        }
        let total = 0;
        for (let slotId = 0; slotId < container.size; slotId++) {
            const itemStack = container.getItem(slotId);
            if (itemStack === undefined || itemStack.typeId !== typeId) {
                continue;
            }
            total += itemStack.amount;
        }
        return total >= required;
    }


    /**
     * @param {Player} player
     * @param {string} effect
     * @param {seconds} duration
     * @param {boolean} hasParticles
     * @param {number} level
     * @author Gamer99
     * @description Adds effects to the player
     * @example
     * import { world } from "@minecraft/server";
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
       if (item.typeId === "minecraft:stick" ) {
            PlayerUtils.addEffect(player,"speed",20,true,3)
       }
    */
    static addEffect(entityType, effect, duration, hasParticles, level) {// func1
        entityType.addEffect(effect, duration * 20, { showParticles: hasParticles, amplifier: level -= 1 })
        // this is the function i created 
    };
    /**
     * 
     * @param {Player} player 
     * @param {ItemStack} item 
     * @param {String|Number} Slot 
     * @readonly @returns typeId
     * @author Gamer99
     * @description gets the item ID in the slot specified 
    
     * @example
     * import { world } from "@minecraft/server";
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
     *    if (PlayerUtils.Getitem(player,"hand") === "minecraft:stick") {
            console.warn("yes");
        };
    */
    static Getitem(player, Slot) {//func2
        const inv = player.getComponent("inventory").container
        const equipment = player.getComponent("equippable")
        if (typeof Slot === "number") {
            const item = inv.getItem(Slot);
            return item?.typeId
        }

        switch (Slot) {
            case "hand":
                return equipment.getEquipment("Mainhand")?.typeId
            case "offhand":
                return equipment.getEquipment("Offhand")?.typeId
            case "head":
                return equipment.getEquipment("Head")?.typeId
            case "chest":
                return equipment.getEquipment("Chest")?.typeId
            case "legs":
                return equipment.getEquipment("Legs")?.typeId
            case "feet":
                return equipment.getEquipment("Feet")?.typeId
        }
    };
    /**
     * 
     * @param {Player} player 
     * @returns Entity ID
     * @author Gamer99
     * @description Gets The ID of the entity the player is looking at 
     * @example
     * import { world } from "@minecraft/server"
     * import { PlayerUtils } from "./utilities/player-utilities";
     * 
       if (item.typeId === "minecraft:stick" && PlayerUtils.getViewEntity(player) === "minecraft:cow") {
           //code 
       }
    })
    */
    static getViewEntity(player) {//func3
        for (const entity of player.getEntitiesFromViewDirection().map(entity => entity.entity)) {
            return entity
        }
    };
    /**
     * Checks if player is in Creative
     * @param {Player} player The player to check
     * @returns {boolean}
     * @example 
      import { world } from "@minecraft/server"
      import { PlayerUtils } from "./utilities/player-utilities";
      
      world.afterEvents.playerInteractWithBlock.subscribe(event=> {
         const player = event.player
         if (PlayerUtils.isCreative(player)){
             console.log("Player is in Creative")
         }
      })
    */
    static isCreative = (player) => player.getGameMode() == (GameMode.creative || GameMode.Creative)

    /**
     * Checks if player is in Survival
     * @param {Player} player The player to check
     * @returns {boolean}
     * @example 
      import { world } from "@minecraft/server"
      import { PlayerUtils } from "./utilities/player-utilities";
      
      world.afterEvents.playerInteractWithBlock.subscribe(event=> {
        const player = event.player
        if (PlayerUtils.isSurvival(player)){
            console.log("Player is in Survival")
        }
      })
    */
    static isSurvival = (player) => player.getGameMode() == (GameMode.survival || GameMode.Survival)

    /**
     * checks if player is in Spectator
     * @param {Player} player The player to check
     * @returns {boolean}
     * @example 
      import { world } from "@minecraft/server"
      import { PlayerUtils } from "./utilities/player-utilities";
      
      world.afterEvents.playerInteractWithBlock.subscribe(event=> {
        const player = event.player
        if (PlayerUtils.isSpectator(player)){
            console.log("Player is in Spectator")
        }
      })
    */
    static isSpectator = (player) => player.getGameMode() == (GameMode.spectator || GameMode.Spectator)

    /**
     * checks if player is in Adventure
     * @param {Player} player The player to check
     * @returns {boolean}
     * @example 
      import { world } from "@minecraft/server"
      import { PlayerUtils } from "./utilities/player-utilities";
      
      world.afterEvents.playerInteractWithBlock.subscribe(event=> {
        const player = event.player
        if (PlayerUtils.isAdventure(player)){
            console.log(`${player.name} is in Adventure`)
        }
      })
    */
    static isAdventure = (player) => player.getGameMode() == (GameMode.adventure || GameMode.Adventure)

}
