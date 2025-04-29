

export class EntityUtils{
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
     * import { EntityUtils } from "./utilities/entity-utilities";
     * 
     * const entity = world.getDimension("overworld").getEntities({ excludeTypes: ["minecraft:player"]})[0];
     * const values = EntityUtils.moveToLocation(entity, { x: 10, y: 200, z: 5 }, 0.5);
     * entity.applyKnockback(values.x, values.z, values.strength, values.y);
    */
    static moveToLocation(entity, targetPos, speed) {
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
     * import { EntityUtils } from "./utilities/entity-utilities";
     * 
     * const player = world.getPlayers()[0];
     * EntityUtils.isUnderground(player);
    */
    static isUnderground(entity) {
        if (entity.dimension.heightRange.min > entity.location.y) return true;
        if (entity.dimension.heightRange.max < entity.location.y) return false;
    
        let block = entity.dimension.getTopmostBlock(player.location)
        if (entity.location.y >= block.y) return false
        while (!block.isSolid && block.y > entity.dimension.heightRange.min) {
          if (entity.location.y >= block.y) return false
          block = block.below()
        }
        return true
    }

    /**
     * Get the Cardinal direction of the entity
     * @author GST378
     * @author finnafinest_
     * @param {entity} entity The entity to get the Cardinal direction of
     * @returns {"up"|"down"|"north"|"east"|"south"|"west"}
    */
    static getCardinalDirection(entity) {
        const yaw = entity.getRotation().y;
        const pitch = entity.getRotation().x;
        if (pitch > 85) return 'down';
        if (pitch < -85) return 'up';
        if (yaw >= -45 && yaw < 45) return 'north';
        else if (yaw >= 45 && yaw < 135) return 'east';
        else if (yaw >= 135 || yaw < -135) return 'south';
        else return 'west';
    };
}
