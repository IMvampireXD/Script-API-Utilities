import { Player, Entity, Block, world, EquipmentSlot, GameMode, ItemStack } from "@minecraft/server";


/**
 * Checks if player is in creative mode.
 * @param {Player} player The player to check
 * @returns {boolean}
 * @example 
 * import { world } from "@minecraft/server"
 * import { PlayerUtils } from "./utilities/player-utilities";
 * 
 * const player = world.getPlayers()[0];
 * if (PlayerUtils.isCreative(player)) {
 *  world.sendMessage(`${player.name} is in creative!`)
 * };
 */
export const isCreative = (player) => player.getGameMode() === (GameMode.creative || GameMode.Creative)

/**
 * Checks if player is in survival mode.
 * @param {Player} player The player to check
 * @returns {boolean}
 * @example 
 * import { world } from "@minecraft/server"
 * import { PlayerUtils } from "./utilities/player-utilities";
 * 
 * const player = world.getPlayers()[0];
 * if (PlayerUtils.isSurvival(player)) {
 *  world.sendMessage(`${player.name} is in survival!`)
 * };
 */
export const isSurvival = (player) => player.getGameMode() === (GameMode.survival || GameMode.Survival)

/**
 * Checks if player is in Spectator mode.
 * @param {Player} player The player to check
 * @returns {boolean}
 * @example 
 * import { world } from "@minecraft/server"
 * import { PlayerUtils } from "./utilities/player-utilities";
 * 
 * const player = world.getPlayers()[0];
 * if (PlayerUtils.isSpectator(player)) {
 *  world.sendMessage(`${player.name} is in Spectator!`)
 * };
 */
export const isSpectator = (player) => player.getGameMode() === (GameMode.spectator || GameMode.Spectator)

/**
 * Checks if player is in Adventure mode.
 * @param {Player} player The player to check
 * @returns {boolean}
 * @example 
 * import { world } from "@minecraft/server"
 * import { PlayerUtils } from "./utilities/player-utilities";
 * 
 * const player = world.getPlayers()[0];
 * if (PlayerUtils.isAdventure(player)) {
 *  world.sendMessage(`${player.name} is in Adventure!`)
 * };
 */
export const isAdventure = (player) => player.getGameMode() === (GameMode.adventure || GameMode.Adventure)


export class PlayerUtils {

    /**
     * @author NaKer
     * Allows to use applyImpulse on player.
     * @param {Vector3} vector
     * @param {Player} player
     */
    static applyImpulse(player, vector) {
        player.applyKnockback(
            { x: vector.x, z: vector.z },
            vector.y < 0.0 ? 0.5 * vector.y : vector.y
        );
    };

    /**
     * Gets the distance between player from ground.
     * 
     * @param {Player} player 
     * @returns {number}
     */
    static distanceToGround(player) {
        const playerPos = { x: player.location.x, y: player.location.y - 1, z: player.location.z };
        const raycastResult = player.dimension.getBlockFromRay(playerPos, { x: 0, y: -1, z: 0 }, { maxDistance: 50 });
        const distanceToGround = playerPos.y - raycastResult.block?.location.y;
        return !raycastResult ? 50 : distanceToGround;
    }

    /**
     * Gets the item in the player's Mainhand.
     * 
     * @param {Player} player
     * @returns {ItemStack | undefined}
     */
    static getMainhand(player) {
        return player?.getComponent('equippable')?.getEquipment(EquipmentSlot.Mainhand);
    };

    /**
     * Gets the item in the player's Offhand.
     * 
     * @param {Player} player
     * @returns {ItemStack | undefined}
     */
    static getOffhand(player) {
        return player?.getComponent('equippable')?.getEquipment(EquipmentSlot.Offhand);
    };

    /**
     * Gets the pitch of Player (X Rotation)
     * @param {Player} player
     */
    static pitch(player) {
        return player?.getRotation().x;
    }

    /** 
     * Gets the yaw of Player (Y Rotation)
     * @param {Player} player
     */
    static yaw(player) {
        return player.getRotation().y;
    }

    /**
     * Gets player current health.
     * @param {Player} player
     */
    static getCurrentHealth(player) {
        return player?.getComponent('minecraft:health').current;
    }

    /**
     * Checks if the player is moving or not.
     * @param {Player} player
     * @returns {boolean} 
     */
    static isMoving(player) {
        const { x, y, z } = player?.getVelocity();
        const speed = Math.hypot(x, y, z);
        return speed > 0;
    }

    /**
     * Teleport a player to the target player by his name.
     * 
     * @param {Player} player - The player who wants to teleport .
     * @param {string} targetName - The name of the target player, where he will be teleported. 
     */
    static teleportToPlayer(player, targetName) {

        /**@type {Player} */
        const target = world.getPlayers({ name: targetName })[0];

        try {
            if (target.isValid) {
                player.teleport(target.location, { dimension: target.dimension });
            } else console.warn(`The target player is not valid.`);

        } catch (e) {
            console.warn(`Failed to teleport player:`, e);
        }
    }

    /** 
     * @param {Player} player 
     * @returns {Block} Block
     * @description Get the block the player is looking at.
     * 
     */
    static getBlockLookingAt(player, maxDistance) {
        try {
            const rayBlock = player.getBlockFromViewDirection({ maxDistance: maxDistance })?.block;
            if (rayBlock) {
                return rayBlock;
            }
        } catch (e) { }
    };

    /**
     * @param {Player} player 
     * @returns {Entity} Entity
     * @description Gets entity the player is looking at
     */
    static getEntityLookingAt(player, maxDistance) {
        try {
            const rayEntity = player.getEntitiesFromViewDirection({ maxDistance: maxDistance })[0]?.entity
            if (rayEntity) {
                return rayEntity;
            }
        } catch (e) { }
    };

    /**
     * Sets an item into a specific equipment slot.
     * @param {Player} target The player
     * @param {EquipmentSlot} slot The slot to place the item in
     * @param {ItemStack} itemStack The item to set
     */
    static setEquipmentSlot(target, slot, itemStack) {
        target?.getComponent("equippable")?.setEquipment(slot, itemStack);
    }

    /**
     * Gets an item from a specific equipment slot.
     * @param {Player} target The player to get equipment from
     * @param {EquipmentSlot} slot The slot to access
     * @returns {ItemStack | undefined}
     */
    static getEquipmentSlot(target, slot) {
        target?.getComponent("equippable")?.getEquipment(slot);
    }

    /**
     * Gets the platform/device the player is using.
     * @author Vyse
     * @param {Player} player
     * @returns {string}
     * @example
     * import { world } from "@minecraft/server"
     * 
     * const player = world.getPlayers()[0];
     * getDevice(player);
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
    }


    /**
     * Function to return boolean whether the player is underground or not
     * checks if player is in underground
     * @author Serty
     * @param {Player} player The player to test if they are underground
     * @returns {boolean}
     * @example
     * import { world } from "@minecraft/server"
     * 
     * const player = world.getPlayers()[0];
     * isUnderground(player);
     */
    static isUnderground(player) {
        if (player.dimension.heightRange.min > player.location.y) return true;
        if (player.dimension.heightRange.max < player.location.y) return false;

        let block = player.dimension.getTopmostBlock(player.location)
        if (player.location.y >= block.y) return false
        while (!block.isSolid && block.y > player.dimension.heightRange.min) {
            if (player.location.y >= block.y) return false
            block = block.below()
        }
        return true
    }

    /**
     * @author Eon
     * @param {Player} player The player to test if they are on surface
     * @returns {boolean} 
     * @example
     * import { world } from "@minecraft/server"
     * 
     * const player = world.getPlayers()[0];
     * isPlayerOnSurface(player);
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
                }
            }
            return true;
        }
        return false;
    }

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
     * 
     * const player = world.getPlayers()[0];
     * const isRidingPlayer = isRidingEntity(player, "minecraft:horse");
     * @throws If player is not a Player.
     */
    static isRidingEntity(player, entityType) {
        if (!player || typeof player.getComponent !== 'function') {
            throw new Error('Invalid player.');
        }
        if (!player.isValid) return;
        const riding = player.getComponent('riding');
        if (!riding) return;
        if (!riding.entityRidingOn) {
            return false;
        }
        if (riding.entityRidingOn.typeId === entityType) {
            return true;
        };
    }

}
