import { Player, EntityInventoryComponent, ItemStack } from "@minecraft/server";
import { ItemStackUtils } from "./itemstack-utilities.js";

export class InventoryUtils {
	/**
	 * Get a player's inventory component easily
	 *
	 * @param {Player} player
	 */
	static getInventory(player) {
		return player.getComponent(EntityInventoryComponent.componentId)?.container;
	}

	/**
	 * Clears player's inventory
	 * @param {Player} player
	 */
	static clearInventory(player) {
		const container = InventoryUtils.getInventory(player);
		for (let i = 0; i < container.size; i++) {
			container.setItem(i, undefined);
		}
	}

	/**
	 * Checks if the player has a specified quantity of a certain item in his inventory.
	 *
	 * @param {Player} player - The player's whose inventory will be checked
	 * @param {string} typeId - typeId of the item to check for
	 * @param {number} count - The required quantity of the item.
	 * @returns {boolean} - True if the player has the amount of specified item, false otherwise.
	 *
	 * @example
	 * import { world } from "@minecraft/server";
	 *
	 * const player = world.getPlayers()[0];
	 * const hasDiamonds = hasItem(player, "minecraft:diamond", 5);
	 */
	static hasItem(player, typeId, count = 1) {
		const inv = InventoryUtils.getInventory(player);
		if (!inv || inv == undefined) return false;
		let total = 0;
		for (let i = 0; i < inv.size; i++) {
			const item = inv.getItem(i);
			if (item == undefined || item.typeId !== typeId) continue;
			if (item && item.typeId === typeId) {
				total += item.amount;
				if (total >= count) return true;
			}
		}
		return false;
	}

	/**
	 * Adds an item to player's inventory
	 *
	 * @param {Player} player - Player
	 * @param {string} itemId - typeId of the Item
	 * @param {number} amount - Amount of the item to add
	 * @param {Object} [data={}] - Additional item data (Enchantments, nameTag, Lore) (No properties will be applied if data is left blank)
	 * @param {string} [data.nameTag] - A custom nameTag to apply to the item.
	 * @param {string[]} [data.lore] - An array of lore lines to apply to the item.
	 * @param {Object.<string, number>} [data.enchantments] - An object of Enchantments to apply.
	 *
	 * @example
	 * addItem(player, "minecraft:apple", 3);
	 *
	 * @example
	 * addItem(player, "minecraft:diamond_sword", 1, {
	 *   nameTag: "sword",
	 *   lore: ["loreLine", "newLore"],
	 *   enchantments: {
	 *     "minecraft:sharpness": 5,
	 *     "minecraft:unbreaking": 3
	 *   }
	 * });
	 */
	static addItem(player, itemId, amount = 1, data = {}) {
		const container = InventoryUtils.getInventory(player);
		const itemStack = new ItemStack(itemId, amount);
		// Apply custom data if provided
		if (data.nameTag) itemStack.nameTag = data.nameTag;
		if (data.lore) itemStack.setLore(data.lore);
		if (data.enchantments) {
			ItemStackUtils.applyEnchantments(itemStack, data.enchantments);
		}
		container.addItem(itemStack);
	}

	/**
	 * Removes a specific amount of items from the player's inventory.
	 *
	 * @param {Player} player - The player.
	 * @param {string} itemId - The typeId of the item to remove.
	 * @param {number} [amount=0] - The number of items to remove. (Clears all if no amount provided)
	 *
	 * @example
	 * -// Remove 5 apples
	 * removeItem(player, "minecraft:apple", 5);
	 *
	 * @example
	 * -// Clear all apples
	 * removeItem(player, "minecraft:apple");
	 */
	static removeItem(player, itemId, amount = 0) {
		const container = InventoryUtils.getInventory(player);
		let remaining = amount;

		for (let i = 0; i < container.size; i++) {
			const item = container.getItem(i);
			if (item && item.typeId === itemId) {
				if (amount === 0) {
					container.setItem(i, undefined);
				} else {
					const removeCount = Math.min(item.amount, remaining);
					item.amount -= removeCount;
					remaining -= removeCount;

					if (item.amount <= 0) {
						container.setItem(i, undefined);
					} else {
						container.setItem(i, item);
					}

					if (remaining <= 0) break;
				}
			}
		}
	}

	/**
	 * A script that saves into a dynamic property and loads full inventory
	 * Saves:
	 * - Durability
	 * - Enchantments
	 * - Lore
	 * - Nametags
	 * - Lock mode
	 * - Keep on death
	 * - Amount
	 * @author trayeplays & Remember M9
	 * @param {Player} player The player to save the inventory of
	 * @param {string} [invName=player.name] Identifier of the dynamic property
	 * @param {Player} storage The player to set the dynamic property on
	 * @returns {{items: string[], wornArmor: string[]}}
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * const player = world.getPlayers()[0];
	 * saveInventory(player);
	 * loadInventory(player);
	 */
	static saveInventory(player, invName = player.name, storage = player) {
		let { container, inventorySize } = player.getComponent("inventory");
		const items = [];
		const listOfEquipmentSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"];
		let wornArmor = [];
		for (let i = 0; i < listOfEquipmentSlots.length; i++) {
			const equipment = player.getComponent("equippable").getEquipment(listOfEquipmentSlots[i]);
			if (!equipment) {
				wornArmor.push(null);
				continue;
			}
			const data = {
				typeId: equipment.typeId,
				props: {
					amount: equipment.amount,
					keepOnDeath: equipment.keepOnDeath,
					lockMode: equipment.lockMode,
				},
				lore: equipment.getLore(),
				components: {},
			};
			if (equipment.nameTag) data.props.nameTag = equipment.nameTag;
			if (equipment.hasComponent("enchantable")) {
				data.components.enchantable = equipment
					.getComponent("enchantable")
					.getEnchantments()
					.map((e) => ({ type: e.type.id, level: e.level }));
			}
			if (equipment.hasComponent("durability")) {
				data.components.durability = equipment.getComponent("durability").damage;
			}
			wornArmor.push(data);
		}
		storage.setDynamicProperty(`armor:${invName}`, JSON.stringify(wornArmor));

		for (let i = 0; i < inventorySize; i++) {
			const item = container.getItem(i);
			if (!item) {
				items.push(null);
				continue;
			}
			const data = {
				typeId: item.typeId,
				props: {
					amount: item.amount,
					keepOnDeath: item.keepOnDeath,
					lockMode: item.lockMode,
				},
				lore: item.getLore(),
				components: {},
			};
			if (item.nameTag) data.props.nameTag = item.nameTag;
			if (item.hasComponent("enchantable")) {
				data.components.enchantable = item
					.getComponent("enchantable")
					.getEnchantments()
					.map((e) => ({ type: e.type.id, level: e.level }));
			}
			if (item.hasComponent("durability")) {
				data.components.durability = item.getComponent("durability").damage;
			}
			items.push(data);
		}
		storage.setDynamicProperty(`inventory:${invName}`, JSON.stringify(items));
		return { items, wornArmor };
	}

	/**
	 * Load the saved inventory
	 * @author trayeplays & Remember M9
	 * @param {Player} player The player to load the inventory to.
	 * @param {string} [invName=player.name] Identifier of the dynamic property to load the items from
	 * @param {Player} storage The player to get the dynamic property from
	 * @returns {void}
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * const player = world.getPlayers()[0];
	 * saveInventory(player);
	 * loadInventory(player);
	 */
	static loadInventory(player, invName = player.name, storage = player) {
		let { container, inventorySize } = player.getComponent("inventory");
		const items = JSON.parse(storage.getDynamicProperty(`inventory:${invName}`) ?? "[]");
		const wornArmor = JSON.parse(storage.getDynamicProperty(`armor:${invName}`) ?? "[]");
		const listOfEquipmentSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"];
		for (let i = 0; i < listOfEquipmentSlots.length; i++) {
			const equipment = player.getComponent("equippable");
			const data = wornArmor[i];
			if (!data) {
				container.setItem(i, null);
			} else {
				const item = new ItemStack(data.typeId);
				for (const key in data.props) {
					item[key] = data.props[key];
				}
				item.setLore(data.lore);
				if (data.components.enchantable) {
					item
						.getComponent("enchantable")
						.addEnchantments(
							data.components.enchantable.map((e) => ({ ...e, type: new EnchantmentType(e.type) })),
						);
				}
				if (data.components.durability) {
					item.getComponent("durability").damage = data.components.durability;
				}
				equipment.setEquipment(listOfEquipmentSlots[i], item);
			}
		}
		for (let i = 0; i < inventorySize; i++) {
			const data = items[i];
			if (!data) {
				container.setItem(i, null);
			} else {
				const item = new ItemStack(data.typeId);
				for (const key in data.props) {
					item[key] = data.props[key];
				}
				item.setLore(data.lore);
				if (data.components.enchantable) {
					item
						.getComponent("enchantable")
						.addEnchantments(
							data.components.enchantable.map((e) => ({ ...e, type: new EnchantmentType(e.type) })),
						);
				}
				if (data.components.durability) {
					item.getComponent("durability").damage = data.components.durability;
				}
				container.setItem(i, item);
			}
		}
	}
}
