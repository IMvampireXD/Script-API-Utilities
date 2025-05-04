import { VECTOR3_DOWN, VECTOR3_NORTH, Vector3Builder } from "./Vector3Utils.js";
import { Entity, Player } from "@minecraft/server";


export class EntityUtils {

    /**
     * Checks if this entity is a player.
     * @param {Entity} entity
     * @returns {boolean}
     */
    static isPlayer(entity) {
        return entity?.typeId === "minecraft:player";
    };

    /**
     * Shoots a projectile from a entity's view direction.
     * @param {string} projectile The projectile typeId to shoot (example, "minecraft:arrow")
     * @param {number} power The speed of the projectile
     * @param {Player} source The entity to shoot the projectile from
     * @returns {Entity} The projectile
     */
    static shootProjectile(projectile, power, source) {
        const headLoc = source.getHeadLocation();
        const viewVector = source.getViewDirection();
        const direction = {
            x: headLoc.x + viewVector.x,
            y: headLoc.y + viewVector.y + viewVector.y * 0.4,
            z: headLoc.z + viewVector.z,
        };
        const vel = { x: viewVector.x * power, y: viewVector.y * power, z: viewVector.z * power };
        const entity = source.dimension.spawnEntity(projectile, direction);
        entity.getComponent("projectile").shoot(vel);

        return entity;
    };

    /**
     * @author frostice482
     * 
     * Gets entity hitbox size
     * @param {Entity} entity Entity
     * @param {number} maxWidth Maximum width
     * @param {number} maxHeight Maximum height
     * @returns {Vector3} Hitbox size
     */
    static getEntityHitboxSize(entity, maxWidth = 4, maxHeight = 4) {
        const dim = entity.dimension
        const loc = entity.location

        // vertical
        loc.y += maxHeight
        const heightRes =
            dim
                .getEntitiesFromRay(loc, VECTOR3_DOWN, { maxDistance: maxHeight })
                .find(v => v.entity === entity)?.distance ?? 0
        const height = maxHeight - heightRes

        // horizontal
        loc.y -= (maxHeight + heightRes) / 2
        loc.z -= maxWidth
        const widthRes =
            dim
                .getEntitiesFromRay(loc, VECTOR3_NORTH, { maxDistance: maxWidth })
                .find(v => v.entity === entity)?.distance ?? 0
        const width = (maxWidth - widthRes) * 2

        return Vector3Builder(width, height, width)
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

}
