import {
	world,
	BlockPermutation,
	ItemStack,
	EquipmentSlot,
	system,
	EnchantmentType,
	BlockTypes,
	ItemComponentTypes
} from "@minecraft/server";

export class ItemStackUtils {

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
	 *   durabilityDamage: 10
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
	 * Check if the item is a tool
	 * @param {ItemStack} item 
	 */
	static isTool(item) {
		const toolTags = ["minecraft:is_axe", "minecraft:is_pickaxe", "minecraft:is_shovel", "minecraft:is_hoe", "minecraft:is_sword", "minecraft:is_tool", "minecraft:trident"];
		const itemTags = item.getTags();
		return toolTags.some(tag => itemTags.includes(tag));
	}

	/**
	 * Serializes an ItemStack, allowing to save the ItemStack data into dynamic property storage.
	 */
	static stringifyItem(itemStack) {
		const result = {
			typeId: itemStack.typeId,
			amount: itemStack.amount,
			nameTag: itemStack.nameTag,
			lockMode: itemStack.lockMode,
			keepOnDeath: itemStack.keepOnDeath,
			lore: itemStack.getLore(),
			canPlaceOn: itemStack.getCanPlaceOn(),
			canDestroy: itemStack.getCanDestroy(),
			components: {},
			dynamicProperties: {}
		};
		const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable);
		if (enchantable) {
			result.components.enchantments = enchantable.getEnchantments().map(e => ({
				type: e.type.id,
				level: e.level
			}));
		}
		const durability = itemStack.getComponent(ItemComponentTypes.Durability);
		if (durability) {
			result.components.durability = {
				damage: durability.damage,
				maxDurability: durability.maxDurability
			};
		}
		const dyeable = itemStack.getComponent(ItemComponentTypes.Dyeable);
		if (dyeable) {
			result.components.dyeColor = dyeable.color;
		}
		for (const id of itemStack.getDynamicPropertyIds()) {
			result.dynamicProperties[id] = itemStack.getDynamicProperty(id);
		}

		return JSON.stringify(result);
	}

	/**
	 * Parses the data of an ItemStack, allowing to retrieve the ItemStack.
	 */
	static parseItem(jsonString) {
		const data = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;

		const itemStack = new ItemStack(data.typeId, data.amount ?? 1);

		if (data.nameTag) itemStack.nameTag = data.nameTag;
		if (data.lockMode) itemStack.lockMode = data.lockMode;
		if (typeof data.keepOnDeath === "boolean") itemStack.keepOnDeath = data.keepOnDeath;
		if (Array.isArray(data.lore)) itemStack.setLore(data.lore);
		if (Array.isArray(data.canPlaceOn)) itemStack.setCanPlaceOn(data.canPlaceOn);
		if (Array.isArray(data.canDestroy)) itemStack.setCanDestroy(data.canDestroy);
		if (data.components) {
			if (Array.isArray(data.components.enchantments)) {
				const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable);
				if (enchantable && data.components.enchantments.length > 0) {
					enchantable.addEnchantments(data.components.enchantments.map(e => ({
						type: new EnchantmentType(e.type),
						level: e.level
					})));
				}
			}
			if (data.components.durability) {
				const durability = itemStack.getComponent(ItemComponentTypes.Durability);
				if (durability) {
					durability.damage = data.components.durability.damage;
				}
			}
			if (data.components.dyeColor) {
				const dyeable = itemStack.getComponent(ItemComponentTypes.Dyeable);
				if (dyeable) {
					dyeable.color = data.components.dyeColor;
				}
			}
		}
		if (data.dynamicProperties) {
			for (const id in data.dynamicProperties) {
				itemStack.setDynamicProperty(id, data.dynamicProperties[id]);
			}
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
			if (BlockTypes?.get(itemStack?.typeId)) return true;
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

	/**
	 * Compares two ItemStacks to determine if they match exactly.
	 * @param {ItemStack} itemStack The first ItemStack to compare.
	 * @param {ItemStack} otherItemStack The second ItemStack to compare against.
	 * @param {boolean} [compareAmount=false] Whether to compare the amount of items.
	 * @returns {boolean} True if the ItemStacks match exactly, otherwise false.
	 */
	static compareItemStacks(itemStack, otherItemStack, compareAmount = false) {

		//ID and Name
		if (itemStack.typeId !== otherItemStack.typeId) return false;
		if (itemStack.nameTag !== otherItemStack.nameTag) return false;

		if (compareAmount) {
			if (itemStack.amount !== otherItemStack.amount) return false;
		} else {
			//Check if they can simply stack
			if (itemStack.isStackable) return itemStack.isStackableWith(otherItemStack);
		}

		//Item Other NBT
		if (itemStack.keepOnDeath !== otherItemStack.keepOnDeath) return false;
		if (itemStack.lockMode !== otherItemStack.lockMode) return false;

		//Lore
		const itemStackLore = itemStack.getLore();
		const otherItemStackLore = otherItemStack.getLore();
		if (itemStackLore.length !== otherItemStackLore.length ||
			!itemStackLore.every((e, i) => e === otherItemStackLore[i])) return false;

		//Item Tags
		const itemStackTags = itemStack.getTags();
		const otherItemStackTags = otherItemStack.getTags();
		if (itemStackTags.length !== otherItemStackTags.length) return false;
		if (itemStackTags.length !== otherItemStackTags.length ||
			!itemStackTags.every((e, i) => e === otherItemStackTags[i])) return false;

		//Components
		const itemStackComponents = itemStack.getComponents();
		const otherItemStackComponents = otherItemStack.getComponents();
		if (itemStackComponents.length !== otherItemStackComponents.length) return false;
		for (let i = 0; i < itemStackComponents.length; i++) {
			const component = itemStackComponents[i];
			const otherComponent = otherItemStackComponents[i];
			switch (component.typeId) {
				case "minecraft:cooldown":
					if (component.cooldownCategory !== otherComponent.cooldownCategory) return false;
					if (component.cooldownTicks !== otherComponent.cooldownTicks) return false;
					break;
				case "minecraft:durability":
					if (component.damage !== otherComponent.damage) return false;
					if (component.maxDurability !== otherComponent.maxDurability) return false;
					break;
				case "minecraft:enchantable":
					const enchants = component.getEnchantments();
					const otherEnchants = otherComponent.getEnchantments();
					if (enchants.length !== otherEnchants.length) return false;
					if (enchants.length > 0) {
						for (let i = 0; i < enchants.length; i++) {
							if (enchants[i].type !== otherEnchants[i].type) return false;
							if (enchants[i].level !== otherEnchants[i].level) return false;
						}
					}
					break;
				case "minecraft:food":
					if (component.canAlwaysEat !== otherComponent.canAlwaysEat) return false;
					if (component.nutrition !== otherComponent.nutrition) return false;
					if (component.saturationModifier !== otherComponent.saturationModifier) return false;
					if (component.usingConvertsTo !== otherComponent.usingConvertsTo) return false;
					break;
				case "minecraft:potion":
					if (component.potionEffectType.id !== otherComponent.potionEffectType.id) return false;
					if (component.potionLiquidType.id !== otherComponent.potionLiquidType.id) return false;
					if (component.potionModifierType.id !== otherComponent.potionModifierType.id) return false;
					break;
			}
		}

		//Dynamic Properties
		const itemStackDPs = itemStack.getDynamicPropertyIds();
		const otherItemStackDPs = otherItemStack.getDynamicPropertyIds();
		if (itemStackDPs.length !== otherItemStackDPs.length) return false;

		for (const id of itemStackDPs) {
			const prop1 = itemStack.getDynamicProperty(id);
			const prop2 = otherItemStack.getDynamicProperty(id);
			if (typeof prop1 !== typeof prop2) return false;

			if (typeof prop1 === 'object' && prop1 !== undefined) return prop1.x == prop2.x && prop1.y == prop2.y && prop1.z == prop2.z;

			if (prop1 !== prop2) return false;
		}
		return true;
	}

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
}
