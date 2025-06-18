import {
	world,
	BlockPermutation,
	ItemStack,
	EquipmentSlot,
	system,
	EnchantmentType,
	BlockTypes,
} from "@minecraft/server";

export class ItemStackUtils {
	/**
	 * Copies all relevant data from one itemStack to another.
	 * @param {ItemStack} item The source item
	 * @param {ItemStack} nextItem The item to copy info into
	 * @returns {ItemStack} The modified item
	 */
	static cloneItemStackInfo(item, nextItem) {
		nextItem.nameTag = item.nameTag;
		nextItem.amount = item.amount;
		nextItem.keepOnDeath = item.keepOnDeath;
		nextItem.lockMode = item.lockMode;
		nextItem.setCanDestroy(item?.getCanDestroy());
		nextItem.setLore(item?.getLore());
		const durability1 = item?.getComponent("durability");
		const durability2 = nextItem?.getComponent("durability");
		durability2.damage = durability1.damage;
		ItemStackUtils.applyEnchantments(nextItem, ItemStackUtils.getEnchantments(item));

		return nextItem;
	}

	/**
	 * Creates a custom ItemStack with additional data (nameTag, lore, enchantments, and durability)
	 *
	 * @param {string} itemId - The typeId of item.
	 * @param {number} [amount=1] - The amount of item.
	 * @param {object} [data={}] - Optional data for the item.
	 * @param {string} [data.nameTag] - nameTag for the item.
	 * @param {string[]} [data.lore] - An array of Lore for the item.
	 * @param {Object.<string, number>} [data.enchantments] - An object of enchantment to apply. Example: { "minecraft:sharpness": 3 }.
	 * @param {number} [data.durabilityDamage] - The amount of durability damage to apply.
	 *
	 * @returns {ItemStack} The ItemStack with the applied properties.
	 *
	 * @example
	 * const sword = createItemStack("minecraft:diamond_sword", 1, {
	 *   nameTag: "Epic Sword",
	 *   lore: ["Sharp and shiny", "Level 3"],
	 *   enchantments: { "minecraft:sharpness": 3, "minecraft:unbreaking": 2 },
	 *   durability: 10
	 * });
	 */
	static createItemStack(itemId, amount = 1, data = {}) {
		const itemStack = new ItemStack(itemId, amount);

		if (data.nameTag) itemStack.nameTag = data.nameTag;
		if (data.lore) itemStack.setLore(data.lore);
		if (data.enchantments) {
			ItemStackUtils.applyEnchantments(itemStack, data.enchantments);
		}
		if (data.durabilityDamage) {
			itemStack.getComponent("minecraft:durability").damage = data.durabilityDamage;
		}
		return itemStack;
	}

	/**
	 * Removes all enchantments from an item
	 *
	 * @author finnafinest_
	 * @param {ItemStack} itemStack
	 * @throws {Error} If the item has no enchantments or enchantments cannot be modified.
	 */
	static clearAllEnchantments(itemStack) {
		const enchantableComp = itemStack.getComponent("minecraft:enchantable");
		if (!enchantableComp.canAddEnchantment || enchantableComp.getEnchantments().length === 0) {
			throw new Error("The item has no enchantments!");
		}
		if (!enchantableComp) return;
		enchantableComp.removeAllEnchantments();
	}

	/**
	 * Serializes an item stack for storage
	 * @param {ItemStack} item
	 * @returns {Object}
	 */
	static serializeItemStack(item) {
		return {
			typeId: item.typeId,
			amount: item.amount,
			nameTag: item.nameTag,
			lore: item.getLore(),
			durability: item.getComponent("minecraft:durability")?.damage,
			enchantments: ItemStackUtils.getEnchantments(item),
		};
	}

	/**
	 * Deserializes an item stack from storage data
	 * @param {Object} data
	 * @returns {ItemStack}
	 */
	static deserializeItemStack(data) {
		const itemStack = new ItemStack(data.typeId, data.amount);

		if (data.nameTag) itemStack.nameTag = data.nameTag;
		if (data.lore) itemStack.setLore(data.lore);
		if (data.durability) {
			itemStack.getComponent("minecraft:durability").damage = data.durability;
		}
		if (data.enchantments) {
			ItemStackUtils.applyEnchantments(itemStack, data.enchantments);
		}

		return itemStack;
	}

	/**
	 * Extracts enchantments from an item
	 *
	 * @author finnafinest_
	 * @param {ItemStack} itemStack - The item to get enchantments from.
	 * @returns {Object.<string, number>} An object with enchantment ID and thier levels.
	 */
	static getEnchantments(itemStack) {
		const enchantableComp = itemStack.getComponent("minecraft:enchantable");
		if (!enchantableComp) return {};

		/** @type {Enchantment[]} */
		const enchants = enchantableComp.getEnchantments();
		const enchantsObj = {};
		for (const enchant of enchants) {
			enchantsObj[enchant.type] = enchant.level;
		}
		return enchantsObj;
	}

	/**
	 *
	 * @param {ItemStack} itemStack
	 * @param {Object} enchantments
	 */
	static applyEnchantments(itemStack, enchantments) {
		const enchantableComp = itemStack.getComponent("minecraft:enchantable");
		if (!enchantableComp.canAddEnchantment) {
			throw new Error("The item is not enchantable!");
		}
		if (!enchantableComp) return;
		Object.entries(enchantments).forEach(([id, level]) => {
			enchantableComp.addEnchantment({ type: new EnchantmentType(id), level: level });
		});
	}

	/**
	 * Transfer enchantments from an item to another
	 *
	 * @param {ItemStack} sourceItem Item to grab enchantments from
	 * @param {ItemStack} destinationItem Item to transfer enchantments to
	 * @returns {ItemStack}
	 *
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * const player = world.getPlayers()[0];
	 * const sourceItem = player.getComponent("inventory").container.getItem(0);
	 * const destinationItem = player.getComponent("inventory").container.getItem(1);
	 * const transferedEnchants = transferEnchantments(sourceItem, destinationItem);
	 * player.getComponent("inventory").container.setItem(1, transferedEnchants);
	 *
	 * @throws If sourceItem is not enchantable
	 * @throws If destinationItem is not enchantable
	 */
	static transferEnchantments(sourceItem, destinationItem) {
		const sourceEnchantable = sourceItem.getComponent("enchantable");
		if (!sourceEnchantable) throw new Error("Source item is not enchantable");
		const destinationEnchantable = destinationItem.getComponent("enchantable");
		if (!destinationEnchantable) throw new Error("Destination item is not enchantable");
		for (const enchantment of sourceEnchantable.getEnchantments()) {
			if (!destinationEnchantable.canAddEnchantment(enchantment)) continue;
			destinationEnchantable.addEnchantment(enchantment);
		}
		return destinationItem;
	}

	/**
	 * @author FetchBot
	 * @remarks Check if ItemStack is a block. For example, a minecraft:stone is a block, but minecraft:iron_shovel isn't.
	 * @param {ItemStack} itemStack
	 * @returns {Boolean}
	 * @example
	 * import { world } from "@minecraft/server";
	 *
	 * world.afterEvents.itemUse.subcscribe((event)=>{
	 *     const { source, itemStack } = event;
	 *     if (isBlock(itemStack)) {
	 *         source.sendMessage("Im a placeable block!")
	 *     }
	 * })
	 */
	static isBlock(itemStack) {
		try {
			BlockTypes?.get(itemStack?.typeId) !== undefined;
		} catch {
			return false;
		}
	}

	/**
	 * @author GegaMC
	 * @remarks Retrieve the EquipmentSlot that this ItemStack can be worn into. For example, an iron chestplate will return "Chest", a totem of undying return "Offhand", whilst a diamond sword which can't be worn or offhanded will defaults to "Mainhand"
	 * @param {ItemStack} itemStack
	 * @returns {EquipmentSlot}
	 * @example
	 * import { world } from "@minecraft/server";
	 *
	 * world.afterEvents.itemUse.subcscribe((event)=>{
	 *     const { source, itemStack } = event;
	 *     const equipmentSlot = getWearableSlot(itemStack);
	 *
	 *     source.sendMessage(`This item is worn on the ${equipmentSlot} Slot`)
	 * })
	 */
	static getWearableSlot(itemStack) {
		//sacrifice random player >:D
		const rPlayer = world.getPlayers()[0];
		const equippable = rPlayer.getComponent("equippable");
		const slots = ["Head", "Chest", "Legs", "Feet", "Offhand", "Mainhand"];
		const prevItemStack = slots.map((s) => equippable.getEquipment(s));
		let slot;
		for (const s of slots)
			if (equippable.setEquipment(s, itemStack)) {
				slot = s;
				break;
			}
		prevItemStack.forEach((e, i) => {
			equippable.setEquipment(slots[i], e);
		});
		system.waitTicks(2).then(() => {
			[
				"armor.equip_chain",
				"armor.equip_diamond",
				"armor.equip_generic",
				"armor.equip_gold",
				"armor.equip_iron",
				"armor.equip_leather",
				"armor.equip_netherite",
			].forEach((sound) => rPlayer.runCommand(`stopsound @s ${sound}`));
		});
		return slot;
	}

	/**
	 * @author GegaMC
	 * @description Get the item contents of an Item. For example, items inside a shulkerbox and bundles
	 * @param {ItemStack} itemStack
	 * @returns {ItemStack[]}
	 * @example
	 * import { world } from '@minecraft/server';
	 *
	 * -//Get shulker contents
	 * world.afterEvents.itemUse.subscribe((evd)=>{
	 * 	const player = evd.source;
	 *     if (evd.itemStack.typeId.endsWith("shulker_box")) {
	 * 		const itemStackContents = ItemStackUtils.getStoredItems(evd.itemStack)
	 * 		for (const itemStack of itemStackContents) {
	 * 			evd.source.sendMessage(`Shulkerbox has: ${itemStack.amount}x ${itemStack.typeId}`)
	 * 		}
	 *     }
	 * })
	 */
	static getStoredItems(itemStack) {
		const { dimension, location } = world.getPlayers()[0];
		const height = dimension.heightRange;
		const spawnLocation = {
			...location,
			y: height.min,
		};

		//Exclude existing item entity & Safeguard againts any hopper-like entities
		const excludeEntity = dimension.getEntitiesAtBlockLocation(spawnLocation);
		excludeEntity.forEach((e) => {
			e.initialPos = e.location;
			e.teleport({
				...e.location,
				y: e.location.y + 5,
			});
		});
		dimension.spawnItem(itemStack, spawnLocation).applyDamage(5, { cause: "lava" });
		excludeEntity.forEach((e) => {
			e.teleport(e.initialPos);
		});
		return dimension
			.getEntitiesAtBlockLocation(spawnLocation)
			.filter((e) => {
				if (e.initialPos) {
					delete e.initialPos;
					return;
				} else return true;
			})
			.map((e, slot) => {
				const itemStack = e.getComponent("item").itemStack;
				e.remove();
				return itemStack;
			});
	}
}
