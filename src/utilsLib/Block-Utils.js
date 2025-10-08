import * as mc from "@minecraft/server";

const { ItemStack, world } = mc;

import { nonSolidBlockTypes } from "./Types";

export class BlockUtils {

	static isSolid(block) {
		const isSolid = block?.dimension.getBlockFromRay(
			block.center(),
			{ x: 0, y: 0.1, z: 0 },
			{
				maxDistance: 1,
				includeLiquidBlocks: true,
				includePassableBlocks: false,
			}
		);
		return isSolid ? true : false;
	}

	static isNonSolid(block) {
		if (block) {
			return block.isAir || nonSolidBlockTypes.has(block.typeId) || block.isLiquid;
		} else {
			return false;
		}
	}

	/**
	 * Cancels the breaking of a specific block type.
	 * @param {string} blockTypeId The type ID of the block to cancel breaking of.
	 * @example
	 * cancelBlockBreaking("minecraft:stone");
	 */
	static cancelBlockBreaking(blockTypeId) {
		world.beforeEvents.playerBreakBlock.subscribe(event => {
			event.cancel = true;
		}, { blockTypes: [blockTypeId] });
	}

	/**
	 * Cancels the placement of a specific block type.
	 * @param {string} blockTypeId The type ID of the block to cancel placement of.
	 * @example
	 * cancelBlockPlacing("minecraft:stone");
	 */
	static cancelBlockPlacing(blockTypeId) {
		world.beforeEvents.playerPlaceBlock.subscribe(event => {
			event.cancel = true;
		}, { blockTypes: [blockTypeId] });
	}

	/**
	 * Get the surrounding blocks connected to a block.
	 * 
	 * @param {mc.Block} block The block to start searching from.
	 * @param {(block: mc.Block) => boolean} [filter] A function that takes a block as an argument and returns a boolean. If the function returns true, the block will be added to the result array.
	 * @param {number} [maxSearch] The maximum number of blocks to search. If not specified, will search all connected blocks.
	 * @returns {mc.Block[]}
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

	static getBlockLocalCoord(block, coords) {
		const blockRotation = block.permutation.getState("facing_direction");
		let localX = 0;
		let localY = 0;
		let localZ = 0;

		switch (blockRotation) {
			case 0: // Down
				localX = coords.x;
				localY = -coords.y;
				localZ = coords.z;
				break;
			case 1: // Up
				localX = coords.x;
				localY = coords.y;
				localZ = coords.z;
				break;
			case 2: // North
				localX = -coords.x;
				localY = coords.y;
				localZ = -coords.z;
				break;
			case 3: // South
				localX = coords.x;
				localY = coords.y;
				localZ = coords.z;
				break;
			case 4: // West
				localX = -coords.z;
				localY = coords.y;
				localZ = coords.x;
				break;
			case 5: // East
				localX = coords.z;
				localY = coords.y;
				localZ = -coords.x;
				break;
		}
		return {
			x: localX + block.location.x,
			y: localY + block.location.y,
			z: localZ + block.location.z
		};
	}

	/**
	 * Retrieves the redstone power level of a specified block.
	 * 
	 * @param {mc.Block} block - The block for which to determine the redstone power level.
	 * @returns {number} The redstone power level of the block or its surroundings.
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
	 * Places a block above the water level at the specified location.
	 * Will keep going up until it finds a non-water block or reaches the maximum height.
	 * If the block above the water is air, it will replace it with the given permutation.
	 * Will also decrement the item in the player's mainhand if the block is placed.
	 * @param {mc.Player} player
	 * @param {mc.BlockPermutation} permutationToPlace
	 * @param {mc.Vector3} location
	 * @returns {mc.Block} The block that was placed
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
	 * Replace blocks in a 3D loaded area of a dimension, defined by two positions.
	 * @param {mc.Dimension} dimension The dimension to replace blocks in.
	 * @param {mc.Vector3} startPosition The starting position of the area.
	 * @param {mc.Vector3} endPosition The ending position of the area.
	 * @param {string} fromBlock The type ID of the block to replace.
	 * @param {string} toBlock The type ID of the block to replace with.
	 */
	static replaceBlocksInArea(dimension, startPosition, endPosition, fromBlock, toBlock) {
		dimension.fillBlocks(new mc.BlockVolume(startPosition, endPosition), toBlock, {
			ignoreChunkBoundErrors: true,
			blockFilter: { includeTypes: [fromBlock] }
		});
	}

	/**
	 * Replace blocks starting from a block with a specified Width, Height, Depth.
	 * @author kiro_one
	 * @param {mc.Block} startBlock The block to start replacing from
	 * @param {number} volumeWidth The width of the volume
	 * @param {number} volumeHeight The height of the volume
	 * @param {number} volumeDepth The depth of the volume
	 * @param {string} replacementBlockType The block type to replace the blocks with
	 * @example
	 * import { world } from "@minecraft/server";
	 *
	 * const block = world.getDimension("overworld").getBlock({x: 0, y: 0, z: 0});
	 * BlockUtils.replaceBlocksFromStartBlock(block, 5, 5, 5, "minecraft:stone");  // Fills a 5x5x5 cube with stone
	 */
	static replaceBlocksFromStartBlock(
		startBlock,
		volumeWidth = 3,
		volumeHeight = 3,
		volumeDepth = 3,
		replacementBlockType,
	) {
		const { block, dimension } = startBlock;

		const halfWidth = Math.floor(volumeWidth / 2);
		const halfHeight = Math.floor(volumeHeight / 2);
		const halfDepth = Math.floor(volumeDepth / 2);

		const min = {
			x: block.location.x - halfWidth,
			y: block.location.y - halfHeight,
			z: block.location.z - halfDepth,
		};
		const max = {
			x: block.location.x + halfWidth,
			y: block.location.y + halfHeight,
			z: block.location.z + halfDepth,
		};

		dimension.fillBlocks(new mc.BlockVolume(min, max), replacementBlockType, {
			ignoreChunkBoundErrors: true,
		});
	}


	/**
	 * Gets all the blocks that satisfy the filter in a 3D loaded area of a dimension.
	 * @param {mc.Dimension} dimension The dimension to search for blocks in.
	 * @param {mc.Vector3} from A location that represents a corner in a 3D rectangle.
	 * @param {mc.Vector3} to A location that represents the opposite corner in a 3D rectangle.
	 * @param {mc.BlockFilter} [filter] Block filter to check for.
	 * @returns {mc.BlockLocationIterator} An iterator yielding all block locations within the volume that match the filter.
	 */
	static getBlocks(dimension, from, to, filter) {
		const blockVolumeList = dimension.getBlocks(new mc.BlockVolume(from, to), filter, true);
		return blockVolumeList.getBlockLocationIterator();
	}

	/**
	 * Iterates over a BlockLocationIterator, calling the callback function for each block location.
	 * If the callback returns `false`, iteration stops early.
	 * @param {mc.BlockLocationIterator} iterator The iterator that yields block locations to be processed.
	 * @param {(location: mc.Vector3) => boolean|void} callback The function to be called for each block location found.
	 */
	static forBlockIterator(iterator, callback) {
		let result = iterator.next();
		while (!result.done) {
			if (callback(result.value) === false) break;
			result = iterator.next();
		}
	}

	/**
	 * Destroys a specified block, dropping its loot. Plays the block destroy particle/sound effects.
	 * @param {mc.Block} block The block to destroy.
	 */
	static destroyBlock(block) {
		const { dimension, location } = block;
		dimension.runCommand(`setblock ${location.x} ${location.y} ${location.z} air destroy`);
	}

	static getAllStates(block) {
		const states = block.permutation.getAllStates();
		return JSON.stringify(states);
	}

	/**
	 * Get all components of a block.
	 * 
	 * @example
	 * const components = BlockUtils.getComponents(block);
	 * console.log(components.map(c => c.typeId));
	 * @author `Remember M9`
	 **/
	static getComponents = (() => {
		const components = Reflect.ownKeys(mc).reduce((list, key) => {
			if (/Block\w+Component$/.test(key)) {
				if (key = mc[key].componentId) {
					list.push(key);
				}
			}
			return list;
		}, []);
		/**
		 * @param {mc.Block} block The block to get components from.
		 * @returns {mc.BlockComponent[]}
		 **/
		return block => components.reduce((a, b) => (((b = block.getComponent(b)) && a.push(b)), a), []);
	})()

};


