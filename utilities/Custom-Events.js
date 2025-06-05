import { world, system, Player } from "@minecraft/server";

export class CustomEvents {
	/**
	 * Detects when player picks up any item.
	 * @param {function({player: player, pickedItem: item})} callBack
	 * @author Carchi77 - Modified by @finnafinest_
	 * GitHub: https://github.com/Carchi777/detect-who-picked-up-an-item
	 *
	 * @example
	 * CustomEvents.onItemPickup((event) => {
	 *     console.warn(`Player ${event.player.name} picked up ${event.pickedItem.amount} amount of ${event.pickedItem.typeId.slice(10)}`);
	 * });
	 */
	static onItemPickup(callBack) {
		const groundItems = new Set();
		world.afterEvents.entitySpawn.subscribe((event) => {
			const entity = event.entity;
			if (entity.hasComponent("item")) {
				groundItems.add(entity);
			}
		});
		world.beforeEvents.entityRemove.subscribe((event) => {
			const entity = event.removedEntity;
			if (!groundItems.has(entity)) return;
			groundItems.delete(entity);

			const itemStack = entity.getComponent("item").itemStack;
			if (!itemStack) return;
			const nearbyPlayers = entity.dimension.getEntities({
				location: entity.location,
				maxDistance: 2,
				type: "player",
			});

			for (const player of nearbyPlayers) {
				const inv = player.getComponent("inventory").container;
				for (let i = 0; i < inv.size; i++) {
					const slotItem = inv.getItem(i);
					if (slotItem && slotItem.typeId === itemStack.typeId) {
						callBack({
							player: player,
							pickedItem: itemStack,
						});
						return;
					}
				}
			}
		});
	}

	/**
	 * Detects when player drops any item.
	 * @param {function({player: player, droppedItem: item})} callBack
	 * @author Minato (Minecraft Bedrock Arabic)
	 *
	 * @example
	 * import { world } from "@minecraft/server"
	 * CustomEvents.onItemDrop((event) => {
	 *     world.sendMessage(`§a${event.droppedItem.typeId}§r was dropped by §2${event.player.name}§r!`)
	 * });
	 *
	 */
	static onItemDrop(callBack) {
		world.afterEvents.entitySpawn.subscribe((event) => {
			const { entity } = event;
			if (entity.typeId !== "minecraft:item") return;
			const closestPlayers = entity.dimension.getEntities({
				type: "minecraft:player",
				location: entity.location,
				maxDistance: 2,
			});
			if (closestPlayers.length == 0) return;
			const player = closestPlayers.find(
				(p) =>
					p.getRotation().x === entity.getRotation().x &&
					p.getRotation().y === entity.getRotation().y,
			);
			if (!player) return;
			const item = entity.getComponent("item").itemStack;

			callBack({ player: player, droppedItem: item });
		});
	}

	/**
	 * Detects when a player shoots a projectile that hits another entity.
	 *
	 * @param {function({player: Player, target: Entity, projectile: string})} callBack A callback function to call when a player shoots a projectile and hits another entity.
	 * @param {Entity} [whom] An entity to watch for hits. If specified, the callback will only be called if the projectile hits this entity.
	 *
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * CustomEvents.onProjectileHit((event) => {
	 *     console.warn(`Player ${event.player.name} shot at ${event.target.typeId}`);
	 * });
	 *
	 */
	static onProjectileHit(callBack, whom = null) {
		world.afterEvents.entitySpawn.subscribe(({ entity }) => {
			if (entity.typeId !== "minecraft:arrow" && entity.typeId !== "minecraft:trident") return;
			const callback = world.afterEvents.projectileHitEntity.subscribe((arg) => {
				const { source, projectile } = arg;
				const hitInfo = arg.getEntityHit();
				if (hitInfo?.entity && source instanceof Player && projectile === entity) {
					const shooter = source;
					const target = hitInfo.entity;
					const projectileType = projectile.typeId;
					if (whom && target !== whom) return;
					callBack({ player: shooter, target: target, projectile: projectileType });
					world.afterEvents.projectileHitEntity.unsubscribe(callback);
				}
			});
		});
	}

	/**
	 * Detects when a player does a jump.
	 *
	 * @param {function({player: Player})} callBack
	 *
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * CustomEvents.onJump((event) => {
	 *     const player = event.player;
	 *     console.warn(`Player ${player.name} did a jump!`);
	 * });
	 *
	 */
	static onJump(callBack) {
		const jumpingPlayers = new Map();
		system.runInterval(() => {
			world.getPlayers().forEach((player) => {
				const wasJumping = jumpingPlayers.get(player) || false;
				const isJumpingNow = player.isJumping;
				if (isJumpingNow && !wasJumping) {
					callBack({ player: player });
					jumpingPlayers.set(player, true);
				} else if (!isJumpingNow && wasJumping) {
					jumpingPlayers.set(player, false);
				}
			});
		}, 1);
	}
}
