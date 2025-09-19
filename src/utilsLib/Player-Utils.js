import {
	Player,
	Entity,
	Block,
	world,
	Dimension,
	EquipmentSlot,
	GameMode,
	ItemStack,
	ItemComponentTypes,
	EntityComponentTypes,
	EntityEquippableComponent,
	EasingType
} from "@minecraft/server";

export const CamShakeType = {
	Positional: "positional",
	Rotational: "rotational"
}

export class PlayerUtils {

	/**
	 * Adds camera shake effect to the specified player.
	 * @param player - The player to apply the camera shake effect to.
	 * @param type - The type of camera shake effect.
	 * @param intensity - The intensity of the camera shake effect.
	 * @param duration - The duration of the camera shake effect in seconds.
	 */
	static addCameraShake(
		player,
		shakeType,
		intensity,
		duration
	) {
		let gamerule = world.gameRules.sendCommandFeedback;
		world.gameRules.sendCommandFeedback = false;
		player.runCommand(
			`camerashake add @s ${intensity.toFixed(20)} ${duration.toFixed(20)} ${shakeType}`
		);
		world.gameRules.sendCommandFeedback = gamerule;
	}

	/**
	 * Stops the camera shake for the specified player.
	 * @param player The player for whom to stop the camera shake.
	 */
	static stopCameraShake(player) {
		player.runCommand(`camerashake stop @s`);
	}

	static thirdPersonOverShoulder(player, offset) {
		const yawRadians = toRadians(player.getRotation().y);
		const pitchRadians = toRadians(player.getRotation().x);
		const sinYaw = Math.sin(yawRadians);
		const cosYaw = Math.cos(yawRadians);
		const sinPitch = Math.sin(pitchRadians);
		const cosPitch = Math.cos(pitchRadians);
		const deltaX = cosYaw * offset.x - sinYaw * offset.z;
		const deltaZ = sinYaw * offset.x + cosYaw * offset.z;
		const deltaY = cosPitch * offset.y + sinPitch * Math.sqrt(offset.x * offset.x + offset.z * offset.z);
		const relativeOffset = {
			x: player.location.x + cosPitch * deltaX,
			y: player.location.y + deltaY,
			z: player.location.z + cosPitch * deltaZ
		};
		player.camera.setCamera("minecraft:free", {
			rotation: player.getRotation(),
			location: relativeOffset,
			easeOptions: {
				easeTime: 0.2,
				easeType: EasingType.Linear,
			},
		});
	}

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
	static isCreative(player) {
		const gm = player.getGameMode();
		return gm === GameMode.creative || gm === GameMode.Creative;
	}

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
	static isSurvival(player) {
		const gm = player.getGameMode()
		return gm === GameMode.survival || gm === GameMode.Survival;
	}

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
	static isSpectator(player) {
		const gm = player.getGameMode()
		return gm === GameMode.spectator || gm === GameMode.Spectator;
	}

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
	static isAdventure(player) {
		const gm = player.getGameMode()
		return gm === GameMode.adventure || gm === GameMode.Adventure;
	}

	/**
	 * The current applyImpulse method is very buggy on players, so this is a new implementation
	 * of applyImpulse. This one tries to replicate the behavior of
	 * the normal impulse as much as possible.
	 * 
	 * @author Bedrock-OSS
	 * @param entity The entity to apply the impulse to.
	 * @param vector The vector of the impulse.
	 */
	static applyImpulse(entity, vector) {
		const { x, y, z } = vector;
		const previousVelocity = entity.getVelocity();
		const horizontalNorm = Math.sqrt(x * x + z * z);
		let directionX = 0;
		let directionZ = 0;
		if (horizontalNorm !== 0) {
			directionX = x / horizontalNorm;
			directionZ = z / horizontalNorm;
		}
		const horizontalStrength = horizontalNorm * 2.5;
		const verticalStrength = y + previousVelocity.y * 0.9;
		entity.applyKnockback(
			{
				x: horizontalStrength * directionX,
				z: horizontalStrength * directionZ,
			},
			verticalStrength
		);
	}

	/**
	 * The clearVelocity method does not work on players, so this is a workaround.
	 * Clears the velocity of an entity. This applies a knockback with the opposite
	 * direction and the same strength as the current velocity in horizontal direction.
	 * 
	 * @author Bedrock-OSS
	 * @param entity The entity to clear the velocity of.
	 */
	static clearVelocity(entity) {
		const { x, z } = entity.getVelocity();
		const horizontalNorm = Math.sqrt(x * x + z * z);
		let directionX = 0;
		let directionZ = 0;
		if (horizontalNorm !== 0) {
			directionX = -x / horizontalNorm;
			directionZ = -z / horizontalNorm;
		}
		entity.applyKnockback(
			{
				x: horizontalNorm * directionX,
				z: horizontalNorm * directionZ,
			},
			0
		);
	}

	/**
	 * Gets the distance between player from ground.
	 *
	 * @param {Player} player
	 * @returns {number}
	 */
	static distanceToGround(player) {
		const playerPos = { x: player.location.x, y: player.location.y - 1, z: player.location.z };
		const raycastResult = player.dimension.getBlockFromRay(
			playerPos,
			{ x: 0, y: -1, z: 0 },
			{ maxDistance: 50 },
		);
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
		return player?.getComponent("equippable")?.getEquipment(EquipmentSlot.Mainhand);
	}

	/**
	 * Gets the item in the player's Offhand.
	 *
	 * @param {Player} player
	 * @returns {ItemStack | undefined}
	 */
	static getOffhand(player) {
		return player?.getComponent("equippable")?.getEquipment(EquipmentSlot.Offhand);
	}

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
		return player?.getComponent("minecraft:health").current;
	}

	/**
	 * Checks if the player is moving or not.
	 * @param {Player} player
	 * @returns {boolean}
	 */
	static isMoving(player) {
		const { x, y, z } = player?.getVelocity();
		return (x !== 0) || (y !== 0) || (z !== 0)
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
	 * Gets the block the player is looking at.
	 * 
	 * @param {Player} player
	 * @returns {Block} Block
	 */
	static getBlockLookingAt(player, maxDistance) {
		try {
			const rayBlock = player.getBlockFromViewDirection({ maxDistance: maxDistance })?.block;
			if (rayBlock) {
				return rayBlock;
			}
		} catch (e) { }
	}

	/**
	 * Gets entity the player is looking at
	 * 
	 * @param {Player} player
	 * @returns {Entity} Entity
	 */
	static getEntityLookingAt(player, maxDistance) {
		try {
			const rayEntity = player.getEntitiesFromViewDirection({ maxDistance: maxDistance })[0];

			if (rayEntity.length > 0) {
				return rayEntity?.entity;
			}
		} catch (e) { }
	}

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

		let block = player.dimension.getTopmostBlock(player.location);
		if (player.location.y >= block.y) return false;
		while (!block.isSolid && block.y > player.dimension.heightRange.min) {
			if (player.location.y >= block.y) return false;
			block = block.below();
		}
		return true;
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
		const blockBelow = player.dimension.getBlock(
			new Vec3(player.location.x, player.location.y, player.location.z).subtract({
				x: 0,
				y: 1,
				z: 0,
			}),
		);
		const blockAbove = player.dimension.getBlock(
			new Vec3(location.x, location.y, location.z).add({ x: 0, y: 1, z: 0 }),
		);

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
		if (pitch > 85) return "down";
		if (pitch < -85) return "up";
		if (yaw >= -45 && yaw < 45) return "north";
		else if (yaw >= 45 && yaw < 135) return "east";
		else if (yaw >= 135 || yaw < -135) return "south";
		else return "west";
	}

	/**
	 * Checks if a player is riding a specific entity type, Or is riding any entity if entity is not specefied
	 * 
	 * @param {Player} player Player to check if riding an entity
	 * @param {string} entityType Type ID of the entity to check, example: "minecraft:horse" - Default value- "any" if no typeId provided
	 * 
	 * @returns {boolean}
	 * 
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * const player = world.getPlayers()[0];
	 * const isRidingHorse = isRidingEntity(player, "minecraft:horse");
	 * const isRiding = isRidingEntity(player, "any");
	 * 
	 * @throws If player is not a Player.
	 */
	static isRidingEntity(player, entityType = "any") {
		if (!player?.isValid) console.warn("Invalid player.");
		const riding = player.getComponent("riding");
		const isRiding = riding?.entityRidingOn;

		if (entityType === "any") {
			if (!isRiding) return false;
			else if (isRiding) return true;
		} else {
			if (!isRiding) return false;
			else if (isRiding.typeId === entityType) return true;
		}
	}

	/**
	 * Decrements the item stack from the player's main hand, unless playing in creative.
	 * @author JeanLucasMCPE
	 * @param {Player} player The player to decrement the main hand item stack.
	 * @param {number} [amount=1] How much the item should decrement. Defaults to `1`.
	 * @param {ItemStack} [itemStack] The item stack to decrement, if available. Otherwise, gets from main hand.
	 * @param {EntityEquippableComponent} [equippable] The player's equippable component for quick access, if available.
	 */
	static decrementMainhandItemStack(player, amount = 1, itemStack = undefined, equippable = undefined) {
		if (this.isCreative(player)) return;

		equippable ??= player.getComponent(EntityComponentTypes.Equippable);
		const handItem = itemStack || equippable?.getEquipment(EquipmentSlot.Mainhand);
		if (!handItem) return;

		const previousItemAmount = handItem.amount;
		if (previousItemAmount > amount) handItem.amount -= amount;
		equippable.setEquipment(EquipmentSlot.Mainhand, previousItemAmount > amount ? handItem : null);
	}

	/**
	 * Damages the item stack player from the player's main hand, unless in creative, factoring in the Unbreaking enchantment level chance.
	 * @author JeanLucasMCPE
	 * @param {Player} player The player using the item.
	 * @param {ItemStack} [itemStack] The item stack to damage, if available. Otherwise, gets from main hand.
	 * @param {EntityEquippableComponent} [equippable] The player's equippable component for quick access, if available.
	 * @param {Dimension} [dimension] The dimension for playing the item break sound if the item breaks (optional, if available).
	 * @returns {boolean} `true` if the damaged item broke, `false` otherwise.
	 */
	static damageMainhandItemStack(player, itemStack = undefined, equippable = undefined, dimension = undefined) {
		if (this.isCreative(player)) return false;

		equippable ??= player.getComponent(EntityComponentTypes.Equippable);
		let handItem = itemStack || equippable?.getEquipment(EquipmentSlot.Mainhand);
		if (!handItem) return false;

		const unbreakingLevel = handItem.getComponent(ItemComponentTypes.Enchantable)?.getEnchantment('unbreaking')?.level || 0;
		const damageChance = 1 / (1 + unbreakingLevel);
		if (Math.random() >= damageChance) return false;

		const durability = handItem.getComponent(ItemComponentTypes.Durability);
		if (!durability) return false;
		const { damage, maxDurability } = durability;

		if (damage < maxDurability) durability.damage++;
		else {
			handItem = null;
			(dimension ?? player.dimension).playSound('random.break', player.location, { pitch: 0.9 });
		}

		equippable.setEquipment(EquipmentSlot.Mainhand, handItem);
		return handItem == null;
	}
}