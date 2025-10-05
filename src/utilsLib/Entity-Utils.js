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
	}

	/**
	 * Checks if the entity is moving or not.
	 * @param {Entity} entity
	 * @returns {boolean}
	 */
	static isMoving(entity) {
		const { x, y, z } = entity?.getVelocity();
		return (x !== 0) || (y !== 0) || (z !== 0)
	}

	/**
	 * Gets the villager's profession.
	 * @param {Entity} entity - The villager entity.
	 * @returns {string | null} The profession ID (e.g. "minecraft:farmer"), or null if not a villager.
	 */
	static getVillagerProfession(entity) {
		if (!entity || entity.typeId !== "minecraft:villager") return null;

		const variantComp = entity.getComponent("minecraft:variant");
		if (!variantComp) return null;

		const variant = variantComp.value;

		const professions = {
			0: "unemployed",
			1: "farmer",
			2: "fisherman",
			3: "shepherd",
			4: "fletcher",
			5: "librarian",
			6: "cartographer",
			7: "cleric",
			8: "armorer",
			9: "weaponsmith",
			10: "toolsmith",
			11: "butcher",
			12: "leatherworker",
			13: "mason",
			14: "nitwit"
		};

		return professions[variant] ?? null;
	}

	/**
	 * Function to check whether the entity is in underground or not.
	 * @author Serty
	 * @param {Entity} entity The entity to test if they are underground
	 * @returns {boolean}
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * const player = world.getPlayers()[0];
	 * isUnderground(player);
	 */
	static isUnderground(entity) {
		if (entity.dimension.heightRange.min > entity.location.y) return true;
		if (entity.dimension.heightRange.max < entity.location.y) return false;

		let block = entity.dimension.getTopmostBlock(entity.location);
		if (entity.location.y >= block.y) return false;
		while (!block.isSolid && block.y > entity.dimension.heightRange.min) {
			if (entity.location.y >= block.y) return false;
			block = block.below();
		}
		return true;
	}

	/**
	 * Checks if an entity is in direct sunlight.
	 * It checks if it is daytime, and if the entity is in surface with no blocks above it.
	 * 
	 * @param {Entity} entity - The entity to test.
	 * @returns {boolean} True if the entity is in sunlight.
	 */
	static isInSunlight(entity) {
		const dimension = entity.dimension;
		const { x, y, z } = entity.location;
		const time = world.getTimeOfDay();
		if (time < 0 || time >= 12000) return false;
		const topBlock = dimension.getTopmostBlock({ x, z });
		if (!topBlock) return false;
		if (y >= topBlock.y + 1) return true;
		const aboveTop = dimension.getBlock({ x, y: topBlock.y + 1, z });
		if (!aboveTop || !aboveTop.isSolid) {
			return y >= topBlock.y + 1;
		}
		return false;
	}

	/**
	 * Get the Cardinal direction of the entity
	 * @author GST378
	 * @author finnafinest_
	 * @param {Entity} entity The entity to get the Cardinal direction of
	 * @returns {"up"|"down"|"north"|"east"|"south"|"west"}
	 */
	static getCardinalDirection(entity) {
		const yaw = entity.getRotation().y;
		const pitch = entity.getRotation().x;
		if (pitch > 85) return "down";
		if (pitch < -85) return "up";
		if (yaw >= -45 && yaw < 45) return "north";
		else if (yaw >= 45 && yaw < 135) return "east";
		else if (yaw >= 135 || yaw < -135) return "south";
		else return "west";
	}


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
		const projectileComp = entity.getComponent("projectile")
		projectileComp.owner = source;
		projectileComp.shoot(vel);

		return entity;
	}

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
		const dim = entity.dimension;
		const loc = entity.location;

		// vertical
		loc.y += maxHeight;
		const heightRes =
			dim
				.getEntitiesFromRay(loc, VECTOR3_DOWN, { maxDistance: maxHeight })
				.find((v) => v.entity === entity)?.distance ?? 0;
		const height = maxHeight - heightRes;

		// horizontal
		loc.y -= (maxHeight + heightRes) / 2;
		loc.z -= maxWidth;
		const widthRes =
			dim
				.getEntitiesFromRay(loc, VECTOR3_NORTH, { maxDistance: maxWidth })
				.find((v) => v.entity === entity)?.distance ?? 0;
		const width = (maxWidth - widthRes) * 2;

		return Vector3Builder(width, height, width);
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
		const dx = targetPos.x - pos.x,
			dy = targetPos.y - pos.y,
			dz = targetPos.z - pos.z;
		const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
		if (!mag) return null;
		const x = (dx / mag) * speed,
			y = (dy / mag) * speed,
			z = (dz / mag) * speed;
		if (entity.typeId === "minecraft:player") {
			const hMag = Math.sqrt(x * x + z * z);
			return { x: x / hMag, z: z / hMag, strength: hMag, y };
		}
		return { x, y, z };
	}
}
