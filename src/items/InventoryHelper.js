import {
	Player
} from "@minecraft/server";

export class InventoryHelper {

	/**
	 * Checks if the player has a specified quantity of a certain item in their inventory.
	 *
	 * @param {Player} player - The player whose inventory is being checked.
	 * @param {string} typeId - The typeId of the item to check for.
	 * @param {number} required - The required quantity of the item.
	 * @returns {boolean} - Returns true if the player has at least the required quantity of the item, false otherwise.
	 * @example
	 * import { world } from "@minecraft/server";
	 * 
	 * const player = world.getPlayers()[0];
	 * const hasDiamonds = isHavingItemQuantity(player, "minecraft:diamond", 5);
	 */
	static hasItem(player, typeId, required = 1) {
		const inventoryComponent = player.getComponent("inventory");
		const container = inventoryComponent.container;
		if (container === undefined) {
			return false;
		}
		let total = 0;
		for (let slotId = 0; slotId < container.size; slotId++) {
			const itemStack = container.getItem(slotId);
			if (itemStack === undefined || itemStack.typeId !== typeId) {
				continue;
			}
			total += itemStack.amount;
		}
		return total >= required;
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
		let {
			container,
			inventorySize
		} = player.getComponent("inventory");
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
					lockMode: equipment.lockMode
				},
				lore: equipment.getLore(),
				components: {}
			};
			if (equipment.nameTag) data.props.nameTag = equipment.nameTag;
			if (equipment.hasComponent("enchantable")) {
				data.components.enchantable = equipment.getComponent("enchantable").getEnchantments().map(e => ({
					type: e.type.id,
					level: e.level
				}));
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
					lockMode: item.lockMode
				},
				lore: item.getLore(),
				components: {}
			};
			if (item.nameTag) data.props.nameTag = item.nameTag;
			if (item.hasComponent("enchantable")) {
				data.components.enchantable = item.getComponent("enchantable").getEnchantments().map(e => ({
					type: e.type.id,
					level: e.level
				}));
			}
			if (item.hasComponent("durability")) {
				data.components.durability = item.getComponent("durability").damage;
			}
			items.push(data);
		}
		storage.setDynamicProperty(`inventory:${invName}`, JSON.stringify(items));
		return {
			items,
			wornArmor
		};
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
		let {
			container,
			inventorySize
		} = player.getComponent("inventory");
		const items = JSON.parse(storage.getDynamicProperty(`inventory:${invName}`) ?? "[]");
		const wornArmor = JSON.parse(storage.getDynamicProperty(`armor:${invName}`) ?? "[]");
		const listOfEquipmentSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"];
		for (let i = 0; i < listOfEquipmentSlots.length; i++) {
			const equipment = player.getComponent("equippable")
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
					item.getComponent("enchantable").addEnchantments(data.components.enchantable.map(e => ({
						...e,
						type: new EnchantmentType(e.type)
					})));
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
					item.getComponent("enchantable").addEnchantments(data.components.enchantable.map(e => ({
						...e,
						type: new EnchantmentType(e.type)
					})));
				}
				if (data.components.durability) {
					item.getComponent("durability").damage = data.components.durability;
				}
				container.setItem(i, item);
			}
		}
	}
}