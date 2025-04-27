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
export function getDevice(player) {
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
 * Move an entity to a location using applyKnockback or applyImpulse

 * @author Coddy
 * @param {Entity} entity The entity to move towards a location
 * @param {Vector3} targetPos The location to move the entity to
 * @param {number} speed The speed of moving the entity
 * @returns {{x: number, z: number, strength: number, y: number} | {x: number, y: number, z: number}} Returns `{x, y, z}` if entity is not a player, otherwise returns `{ x, z, strength, y }`
 * @example
 * import { world } from "@minecraft/server"
 * 
 * const player = world.getPlayers()[0];
 * const values = moveToLocation(player, { x: 10, y: 200, z: 5 }, 0.5);
 * player.applyKnockback(values.x, values.z, values.strength, values.y);
 * @example
 * import { world } from "@minecraft/server"
 * 
 * const entity = world.getDimension("overworld").getEntities({ excludeTypes: ["minecraft:player"]})[0];
 * const values = moveToLocation(entity, { x: 10, y: 200, z: 5 }, 0.5);
 * entity.applyKnockback(values.x, values.z, values.strength, values.y);
*/
export function moveToLocation(entity, targetPos, speed) {
    const pos = entity.location;
    const dx = targetPos.x - pos.x, dy = targetPos.y - pos.y, dz = targetPos.z - pos.z;
    const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (!mag) return null;
    const x = (dx / mag) * speed, y = (dy / mag) * speed, z = (dz / mag) * speed;
    if (entity.typeId === 'minecraft:player') {
      const hMag = Math.sqrt(x * x + z * z);
      return { x: x / hMag, z: z / hMag, strength: hMag, y };
    }
    return { x, y, z };
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
export function isUnderground(player) {
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
export function isPlayerOnSurface(player) {
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
export function getCardinalDirection(player) {
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
 * @throws if Player doesn't have a `riding` component
 */
export function isRidingEntity(player, entityType) {
    // Validate the player object
    if (!player || typeof player.getComponent !== 'function') {
        throw new Error('Invalid player object provided. Player must have a `getComponent` method.');
    }
    // Safely get the 'riding' component
    const riding = player.getComponent('riding');
    // Validate the riding component and entityRidingOn
    if (!riding) {
        throw new Error('Player does not have a `riding` component.');
    }
    if (!riding.entityRidingOn) {
        throw new Error('Player is not riding any entity.');
    }
    // Compare the typeId of the entity being ridden with the provided entityType
    return riding.entityRidingOn.typeId === entityType;
}




/**
 * Checks if player is creative
 * @param {Player} player The player to check
 * @returns {boolean}
 * @example 
 * import { world } from "@minecraft/server"
 * 
 * const player = world.getPlayers()[0];
 * if (isCreative(player)) {
 *  world.sendMessage(`${player.name} is in creative!`)
 * };
 */
export const isCreative = (player) => player.getGameMode() == (GameMode.creative || GameMode.Creative)
export const isSurvival = (player) => player.getGameMode() == (GameMode.survival || GameMode.Survival)
export const isSpectator = (player) => player.getGameMode() == (GameMode.spectator || GameMode.Spectator)
export const isAdventure = (player) => player.getGameMode() == (GameMode.adventure || GameMode.Adventure)
