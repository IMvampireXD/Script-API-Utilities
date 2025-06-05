import { ItemStack, world, Player, Block } from "@minecraft/server";

export class BlockUtils {
	/**
	 * @param {string} blockTypeId
	 */
	static cancelBlockBreaking(blockTypeId) {
		world.beforeEvents.playerBreakBlock.subscribe(({ block, cancel }) => {
			if (block?.typeId === blockTypeId) {
				cancel = true;
			}
		});
	}

	/**
	 * @param {string} blockTypeId
	 */
	static cancelBlockPlacing(blockTypeId) {
		world.beforeEvents.playerPlaceBlock.subscribe(({ block, cancel }) => {
			if (block?.typeId === blockTypeId) {
				cancel = true;
			}
		});
	}

	/**
	 * Gets surrounding blocks connected to the current block.
	 * @param {Block} block - Starting block.
	 * @param {(block: Block) => boolean} filter - A filter to match desired blocks.
	 * @param {number} maxSearch - Maximum number of blocks to search
	 * @returns {Block[]} - Array of adjacent blocks.
	 *
	 * @example
	 * world.beforeEvents.playerBreakBlock.subscribe(({ block, itemStack }) => {
	 *  if (itemStack?.typeId !== "minecraft:stick") return;
	 *
	 *  const filter = (b) => b.typeId === "minecraft:stone";
	 *
	 *  getNearbyBlocks(block, filter, 100).forEach((e) => {
	 *
	 *      system.run(() => e.setType(`air`));
	 *
	 *    })
	 * })
	 *
	 */
	static getNearbyBlocks(block, filter, maxSearch) {
		function vec3(x, y, z) {
			return {
				x,
				y,
				z,
				add(other) {
					return vec3(this.x + other.x, this.y + other.y, this.z + other.z);
				},
				toString() {
					return `${this.x},${this.y},${this.z}`;
				},
			};
		}
		const Vec3 = {
			directions: [
				vec3(1, 0, 0),
				vec3(-1, 0, 0),
				vec3(0, 1, 0),
				vec3(0, -1, 0),
				vec3(0, 0, 1),
				vec3(0, 0, -1),
			],
		};
		const connectedBlocks = [];
		const visited = new Map();
		const posToKey = (pos) => `${pos.x},${pos.y},${pos.z}`;

		const startPos = vec3(block.location.x, block.location.y, block.location.z);
		const queue = [startPos];
		visited.set(posToKey(startPos), true);

		while (queue.length > 0 && connectedBlocks.length < maxSearch) {
			const currentPos = queue.shift();

			let currentBlock;
			try {
				currentBlock = block.dimension.getBlock(currentPos);
			} catch (err) {
				console.warn(err, err.stack);
				continue;
			}

			if (!currentBlock || !filter(currentBlock)) continue;
			connectedBlocks.push(currentBlock);

			for (const direction of Vec3.directions) {
				if (connectedBlocks.length >= maxSearch) break;

				const neighborPos = currentPos.add(direction);
				const key = posToKey(neighborPos);
				if (visited.has(key)) continue;
				visited.set(key, true);

				let neighbor;
				try {
					neighbor = block.dimension.getBlock(neighborPos);
				} catch (err) {
					console.warn(err, err.stack);
					continue;
				}

				if (!neighbor || neighbor.typeId === "minecraft:air") continue;
				if (filter(neighbor)) {
					queue.push(neighborPos);
				}
			}
		}

		return connectedBlocks;
	}

	/**
	 * Gets redstone power of the block
	 * @param {Block} block
	 * @returns {number}
	 */
	static getRedstonePower(block) {
		const blockRedstonePower = block.getRedstonePower();
		if (blockRedstonePower == 0) {
			for (let face of ["north", "south", "east", "west", "below"]) {
				const newBlock = block[face]();
				const newBlockRedstonePower = newBlock?.getRedstonePower();
				const avoidBlocks = ["redstone_wire", "repeater", "comparator", "redstone_torch"];
				if (
					(newBlockRedstonePower > 0 &&
						!avoidBlocks.some((block) => newBlock?.typeId.includes(block))) ||
					(newBlock?.typeId.includes("redstone_torch") &&
						newBlock?.permutation.getState("torch_facing_direction") != invertFace[face])
				) {
					return newBlockRedstonePower;
				}
			}
			const aboveBlock = block.above();
			const aboveBlockPower = aboveBlock?.getRedstonePower();
			if (aboveBlock?.typeId == "minecraft:daylight_detector" && aboveBlockPower > 0)
				return aboveBlockPower;
		}
		return blockRedstonePower;
	}

	/**
	 * Function to place a block directly above water.
	 * @author GST378
	 * @remarks MAKE SURE YOUR ITEM HAS THIS COMPONENT - "minecraft:liquid_clipped": true
	 * @param {Player} player - The player placing the block.
	 * @param {BlockPermutation} permutationToPlace - The block permutation to be placed.
	 * @param {Vector3} location - The starting location to search for placement.
	 * @returns {Block | undefined} - Returns the placed block or undefined if no block was placed.
	 * @example
	 * if (block.typeId !== 'minecraft:water') return;
	 * if (itemStack.typeId === 'mc:example') {
	 *  data.cancel = true;
	 *   system.run(() => {
	 *      placeBlockAboveWater(source, BlockPermutation.resolve('minecraft:waterlily'), block.location);
	 *   });
	 *  }
	 */
	static placeBlockAboveWater(player, permutationToPlace, location) {
		for (let i = 0; i < 8; i++) {
			if (player.location.y < location.y) break;
			const block = player.dimension.getBlock(location);
			location.y++;
			if (block.typeId === "minecraft:water" || block.isWaterlogged) continue;
			else if (!block.isAir) break;
			else {
				block.setPermutation(permutationToPlace);
				const equippableComp = player.getComponent("equippable");
				const item = equippableComp.getEquipment("Mainhand");
				if (!item) break;
				if (item.amount <= 1) equippableComp.setEquipment("Mainhand", null);
				else {
					item.amount--;
					equippableComp.setEquipment("Mainhand", item);
				}
			}
		}
		return player.dimension.getBlock(location);
	}

	/**
	 * Replaces all blocks of a type in an area.
	 * @param {Vector3} startPosition - Start corner of area
	 * @param {Vector3} endPosition - End corner of area
	 * @param {string} fromBlock - Block typeID to replace
	 * @param {string} toBlock - New block typeID
	 */
	static replaceBlocksInArea(startPosition, endPosition, fromBlock, toBlock) {
		const minX = Math.min(startPosition.x, endPosition.x);
		const minY = Math.min(startPosition.y, endPosition.y);
		const minZ = Math.min(startPosition.z, endPosition.z);
		const maxX = Math.max(startPosition.x, endPosition.x);
		const maxY = Math.max(startPosition.y, endPosition.y);
		const maxZ = Math.max(startPosition.z, endPosition.z);

		for (let x = minX; x <= maxX; x++) {
			for (let y = minY; y <= maxY; y++) {
				for (let z = minZ; z <= maxZ; z++) {
					const pos = { x, y, z };
					const block = world.getDimension("overworld").getBlock(pos);
					if (block && block.typeId === fromBlock) {
						block.setType(toBlock);
					}
				}
			}
		}
	}

	/**
	 * Breaks blocks from start block with a specified Width, Height, Depth.
	 * @author kiro_one
	 * @param {Block} startBlock The block to start breaking from
	 * @param {number} volumeWidth The width of the volume
	 * @param {number} volumeHeight The height of the volume
	 * @param {number} volumeDepth The depth of the volume
	 * @param {string} replacementBlockType The block to replace the blocks with
	 * @example
	 * import { world, system } from "@minecraft/server"
	 *
	 * const block = world.getDimension("overworld").getBlock({x: 0, y: 0, z: 0});
	 * replaceBlocksFromStartBlock(block, 5, 5, 5, "stone"); // Fills a 5x5x5 cube with stone
	 */
	static replaceBlocksFromStartBlock(
		startBlock,
		volumeWidth = 3,
		volumeHeight = 3,
		volumeDepth = 3,
		replacementBlockType,
	) {
		const { brokenBlockPermutation, block, dimension } = startBlock;
		const typeId = brokenBlockPermutation.type.id;
		const item = new ItemStack(typeId, 1);
		// Calculate the bounds of the volume to reduce overhead
		const halfWidth = Math.floor(volumeWidth / 2);
		const halfHeight = Math.floor(volumeHeight / 2);
		const halfDepth = Math.floor(volumeDepth / 2);
		const minX = block.location.x - halfWidth;
		const minY = block.location.y - halfHeight;
		const minZ = block.location.z - halfDepth;
		const maxX = block.location.x + halfWidth;
		const maxY = block.location.y + halfHeight;
		const maxZ = block.location.z + halfDepth;
		// Iterate directly within the volume bounds
		for (let x = minX; x <= maxX; x++) {
			for (let y = minY; y <= maxY; y++) {
				for (let z = minZ; z <= maxZ; z++) {
					const location = { x, y, z };
					const currentBlock = dimension.getBlock(location);
					dimension.setBlockType(location, replacementBlockType); // Replace with the specified block type
					dimension.spawnItem(item, location);
				}
			}
		}
	}

	/**
	 * @author Dmahonjr06
	 * @param {string} callback Your event 'callback' parameter
	 * @param {property} block Your definition for 'event' property 'block'.
	 * @param {string} blockID Your block name, as "[identifier]:[block_name]"
	 * @param {string} itemToDrop1 Item1 to drop from your block
	 * @param {number} chance1 Item1's chance of dropping, ranging from 0.00-1.00
	 * @param {number} amount1 How many items will drop if
	 * @param {string} itemToDrop2 (optional) Item2 to drop from your block
	 * @param {number} chance2 (optional) Item2's chance of dropping
	 * @param {number} amount2 (optional) How many items will drop
	 * @param {string} itemToDrop3 (optional) Item3 to drop from your block
	 * @param {number} chance3 (optional) Item3's chance of dropping
	 * @param {number} amount3 (optional) amount of 'itemTodrop3' to drop
	 * @example
	 * import { ItemStack, system, world } from "@minecraft/server";
	 * world.afterEvents.playerBreakBlock.subscribe(event => {
	 *    const {block} = event.block;
	 *
	 *   ## Must be declared outside of system.run, otherwise blockID won't be
	 *   let lootTable = BlockLootTable("event", block, "dmahonjr:bauxite_ore", "dmahonjr:raw_aluminium", 0.23, 1, "minecraft:iron_nugget", 0.27, 3, "minecraft:clay", 0.50, 2);
	 *   system.run(()=> {
	 *       lootTable
	 *   });
	 *
	 * })
	 *
	 */
	static BlockLootTable(
		callback = undefined,
		block = undefined,
		blockID = undefined,
		itemToDrop1 = undefined,
		chance1 = null,
		amount1 = null,
		itemToDrop2 = undefined,
		chance2 = null,
		amount2 = null,
		itemToDrop3 = undefined,
		chance3 = null,
		amount3 = null,
	) {
		let weight = Math.random().toFixed(2);
		console.log(`weight: ${weight}`);
		let loot;
		try {
			if (typeof callback !== "string")
				throw new Error(`'callback' is ${callback}. 'callback' needs to be a string`);
			if (block == undefined)
				throw new Error(
					`'block' is not defined. 'block' is needed to be defined in the playerbreakBlock event`,
				);
			if (typeof block !== "object") throw new Error(`'block' is not an object`);
			if (blockID == undefined) throw new Error(`'blockID' is ${blockID}`);
			if (typeof blockID !== "string") throw new Error(`'blockID' is not a 'string'`);
			if (!blockID.includes(":"))
				throw new Error(`'blockID' does not include an <identifier:>. An identifier is needed`);
			//item1
			if (itemToDrop1 == undefined)
				throw new Error(
					`'itemToDrop1' is ${itemToDrop1}. You need to define item1 in the LootTableBlock function)`,
				);
			if (typeof itemToDrop1 !== "string") throw new Error(`'itemToDrop1' is not a 'string'`);
			if (!itemToDrop1.includes(":"))
				throw new Error(`'itemToDrop1' does not include an <identifier:>. An identifier is needed`);
			if (chance1 == null || chance1 <= 0)
				throw new Error(`'chance1' is ${chance1}. 'chance1' should be a number greater than 0.00`);
			if (chance1 > 1)
				throw new Error(`chance1 is ${chance1}. 'chance1' should be a number less than 1.00`);
			if (typeof chance1 !== "number") throw new Error(`'itemToDrop1' is not a 'number'`);
			if (amount1 == null)
				throw new console.error(`'amount1' is ${amount1}. An item amount is needed.`);
			if (typeof amount1 !== "number") throw new Error(`'amount1' is not a 'number'`);
			//item2
			if (!itemToDrop2 == undefined && typeof itemToDrop2 !== "string")
				throw new Error(`'itemToDrop2' is ${itemToDrop2}. You need to define 'itemToDrop2'`);
			if (!itemToDrop2.includes(":"))
				throw new Error(`'itemToDrop2' does not include an <identifier:>. An identifier is needed`);
			if (chance2 == null || chance1 <= 0)
				throw new Error(`'chance2' is ${chance2}. 'chance2' should be a number greater than 0.00`);
			if (chance2 > 1)
				throw new Error(`'chance1' is ${chance1}. 'chance2' should be a number less than 1.00`);
			if (typeof chance2 !== "number") throw new Error(`'itemToDrop2' is not a 'number'`);
			if (amount2 == null)
				throw new console.error(`'amount2' is ${amount2}. An item amount is needed.`);
			if (typeof amount2 !== "number") throw new Error(`'amount2' is not a 'number'`);
			//item3
			if (itemToDrop3 !== undefined && typeof itemToDrop3 !== "string")
				throw new Error(`'itemToDrop3' is ${itemToDrop3}. 'itemToDrop3' needs to be defined`);
			if (!itemToDrop3.includes(":"))
				throw new Error(`'itemToDrop3' does not include an <identifier:>. An identifier is needed`);
			if (chance3 == null || chance1 <= 0)
				throw new Error(`'chance3' is ${chance3}. 'chance3' should be a number greater than 0.00`);
			if (chance3 > 1)
				throw new Error(`'chance1' is ${chance1}. 'chance3' should be a number less than 1.00`);
			if (typeof chance3 !== "number") throw new Error(`'itemToDrop3' is not a 'number'`);
			if (amount3 == null)
				throw new console.error(`'amount3' is ${amount3}. An item amount is needed.`);
			if (typeof amount3 !== "number") throw new Error(`'amount3' is not a 'number'`);
			let totalPercentage = chance1 + chance2 + chance3;
			if (totalPercentage !== 1)
				throw new Error(`Your total % is ${totalPercentage} Total needs to be 1.00`);
		} catch (error) {
			console.error(error);
			return;
		}
		if (weight < chance1) {
			loot = new ItemStack(itemToDrop1, amount1);
			console.log("dropped item 1");
		} else if (weight >= chance1 && weight < chance1 + chance2) {
			loot = new ItemStack(itemToDrop2, amount2);
			console.log("dropped item 2");
		} else if (weight >= chance1 + chance2 && weight < chance1 + chance2 + chance3) {
			loot = new ItemStack(itemToDrop3, amount3);
			console.log("dropped item 3");
		}
		return system.run(() => {
			block.dimension.spawnItem(loot, block.center());
			callback.cancel == true;
		});
	}
}
