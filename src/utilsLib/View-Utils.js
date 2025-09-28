import { world, Entity } from "@minecraft/server";

export class ViewUtils {

/**
 * Get normalized direction vector from one point to another
 * @param {{x:number,y:number,z:number}} vector1 - start point
 * @param {{x:number,y:number,z:number}} vector2 - end point
 * @returns {{x:number,y:number,z:number}}
 */
static getDirection(vector1, vector2) {
    const dx = vector2.x - vector1.x;
    const dy = vector2.y - vector1.y;
    const dz = vector2.z - vector1.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return { x: dx / distance, y: dy / distance, z: dz / distance };
}

/**
 * Get what direction the entity got hit from.
 * @param {Entity} victim
 * @param {Entity} attacker
 * @returns {'front' | 'left' | 'right' | 'back' | null}
 */
static getEntityHurtDirection(victim, attacker) {
    if (!(victim instanceof Entity) || !attacker.isValid) return null;
    const dir = ViewUtils.getDirection(victim.location, attacker.location);
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
