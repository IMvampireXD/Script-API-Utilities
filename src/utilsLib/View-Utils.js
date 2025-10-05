import { world, Entity } from "@minecraft/server";
import { LocationUtils } from "./Location-Utils";

export class ViewUtils {

    /**
     * Gets entities within a cone (field of view) in front of the given entity.
     *
     * @param {Entity} sourceEntity - The entity whose view direction is used.
     * @param {number} [maxDistance=6] - Maximum distance to search (in blocks).
     * @param {number} [fov=60] - Field of view angle in degrees.
     * @param {object} [options={}] - Additional entity query options (e.g. type, families).
     * @returns {Entity[]} Entities found within the cone of vision.
     *
     * @example
     * import { world } from "@minecraft/server";
     *
     * for (const player of world.getPlayers()) {
     *   const targets = getEntitiesFromAngle(player, 10, 45, { type: "minecraft:zombie" });
     *   player.sendMessage(`Found ${targets.length} zombies in front of you!`);
     * }
     */
    static getEntitiesFromAngle(sourceEntity, maxDistance = 6, fov = 60, options = {}) {
        const viewDir = sourceEntity.getViewDirection();
        const pLoc = sourceEntity.location;

        const cosFov = Math.cos((fov * Math.PI) / 180);

        const queryOptions = {
            ...options,
            maxDistance,
            location: pLoc
        };

        const results = [];

        for (const entity of sourceEntity.dimension.getEntities(queryOptions)) {
            if (entity === sourceEntity) continue;

            const dx = entity.location.x - pLoc.x;
            const dy = entity.location.y - pLoc.y;
            const dz = entity.location.z - pLoc.z;

            const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (mag === 0) continue;

            const cosAngle = (viewDir.x * dx + viewDir.y * dy + viewDir.z * dz) / mag;

            if (cosAngle >= cosFov) {
                results.push(entity);
            }
        }

        return results;
    }

    /**
     * Get what direction the entity got hit from.
     * @param {Entity} victim
     * @param {Entity} attacker
     * @returns {'front' | 'left' | 'right' | 'back' | null}
     */
    static getEntityHurtDirection(victim, attacker) {
        if (!(victim instanceof Entity) || !attacker.isValid) return null;
        const dir = LocationUtils.getDirection(victim.location, attacker.location);
        const dirX = dir.x;
        const dirZ = dir.z;
        const yaw = (victim.getRotation().y * Math.PI) / 180;
        const lookX = -Math.sin(yaw);
        const lookZ = Math.cos(yaw);
        const angle = (Math.atan2(dirX * lookZ - dirZ * lookX, lookX * dirX + lookZ * dirZ) * 180) / Math.PI;
        if (angle >= -45 && angle <= 45) return "front";
        if (angle > 45 && angle <= 135) return "left";
        if (angle < -45 && angle >= -135) return "right";
        return "back";
    }

}
