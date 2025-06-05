import { Dimension, ItemStack, system, world, Block, ItemStack } from "@minecraft/server";

let initialized_overworld;
let initialized_nether;
let initialized_theEnd;

/**
 * Load dimension before accessing to fix priviledge error
 * Access the initialized dimension using static methods in DimensionUtils
 */
world.afterEvents.worldLoad.subscribe(() => {
	initialized_overworld = world.getDimension("minecraft:overworld");
	initialized_nether = world.getDimension("minecraft:nether");
	initialized_theEnd = world.getDimension("minecraft:the_end");
});

export class DimensionUtils {
	/**
	 * Get the Overworld dimension, easily without priviledge error.
	 * @type {Dimension}
	 * @readonly
	 */
	static get overworld() {
		return initialized_overworld;
	}

	/**
	 * Get the Nether dimension, easily without getting priviledge error.
	 * @type {Dimension}
	 * @readonly
	 */
	static get nether() {
		return initialized_nether;
	}

	/**
	 * Get the End dimension, easiliy without getting priviledge error.
	 * @type {Dimension}
	 * @readonly
	 */
	static get theEnd() {
		return initialized_theEnd;
	}

	/**
	 * Run multiple commands at once.
	 *
	 * @param {Dimension} dimension - The dimension to run commands.
	 * @param {string[]} commands - An array of command strings to execute.
	 *
	 * @example
	 * DimensionUtils.runCommands(player.dimension, [
	 *       `say Giving apple to player!`,
	 *       `give @s apple 1`,
	 *       `say Done!`
	 *   ])
	 */
	static runCommands(dimension, commands) {
		for (const cmd of commands) {
			dimension.runCommand(cmd);
		}
	}

	/**
	 * Spawn an item in a location.
	 *
	 * @param {Dimension} dimension - Dimension to spawn the item in
	 * @param {string} typeId - typeId of the item to spawn
	 * @param {Vector3} location - Location where to spawn the item
	 * @param {number} amount - Amount of items to spawn
	 * @param {string} nameTag - Nametag of the item
	 * @returns {void}
	 *
	 * @throws If the dimension is not valid.
	 * @throws If the typeId is not a string.
	 * @throws If the amount is not a positive integer.
	 * @throws If the location is not valid.
	 *
	 * @example
	 * import { world } from "@minecraft/server"
	 *
	 * const dimension = world.getDimension("overworld");
	 * const location = {x: 0, y: 0, z: 0}
	 *
	 * DimensionUtils.spawnItem(dimension, "minecraft:diamond", location, 64);
	 *
	 */
	static spawnItem(dimension, typeId, location, amount = 1, nameTag = null) {
		if (!dimension || typeof dimension.spawnItem !== "function") {
			console.error("Error: Invalid Dimension object. Ensure it has a spawnItem method.");
			return;
		}
		if (!typeId || typeof typeId !== "string") {
			console.error("Error: Invalid typeId. It should be a non-empty string.");
			return;
		}
		if (!Number.isInteger(amount) || amount <= 0) {
			console.error("Error: Invalid amount. It should be a positive integer.");
			return;
		}
		if (!location || typeof location !== "object") {
			console.error("Error: Invalid location. It should be an object.");
			return;
		}
		const item = new ItemStack(typeId, amount);
		if (nameTag) item.nameTag = nameTag;
		try {
			dimension.spawnItem(item, location);
		} catch (error) {
			console.error("Error: Failed to spawn item.", error);
		}
	}

	/**
	 * Gets a block from any dimension & location in world asynchronously (Even if the chunk is unloaded)
	 * @param {Vector3} location
	 * @param {Dimension} dim
	 * @returns {Promise<Block>}
	 * @example
	 * getBlock(loc, world.getDimension('overworld')).then(block => {})
	 *
	 */
	static async getBlock(location, dim = world.getDimension("overworld")) {
		let block,
			{ x, y, z } = location;
		const getBlock = dim.getBlock.bind(dim, location);
		try {
			if (!(block = getBlock())) throw null;
			else return block;
		} catch {
			dim.runCommand(`tickingarea add circle ${~~x} ${~~y} ${~~z} 0 "${x},${y},${z}"`);
			let remove = () => dim.runCommand(`tickingarea remove "${x},${y},${z}"`);
			return new Promise(async (resolve) => {
				system.runJob(
					(function* () {
						let trials = 1e3;
						do {
							block = getBlock();
							if (!--trials) yield void remove();
						} while (!block);
						remove();
						return resolve(block);
					})(),
				);
			});
		}
	}

	/**
	 * @beta (Require Beta-API)
	 * @author GegaMC
	 * @description Get the approximate biome on a location. ( Underground biomes are supported. )
	 * @param {Vector3} location the location where it should check
	 * @param {Dimension|string} dimension the dimension where it should check
	 * @throws Throws if the given dimension name or instance is invalid
	 * @returns {Promise<string>}
	 * @example
	 * import { world } from '@minecraft/server';
	 *
	 * world.afterEvents.itemUse.subscribe((evd)=>{
	 *   if (evd.itemStack.typeId == "minecraft:stick")
	 *       testBiome(evd.source);
	 * })
	 *
	 * async function testBiome(player) {
	 *   const biomeId = await DimensionUtils.getBiome(player.location,player.dimension)
	 *   player.sendMessage(`Youre inside: ${biomeId}`)
	 * }
	 */
	static async getBiome(location, dimension) {
		//Safeguard if using stable api when importing BiomeTypes
		let biomeTypes = this.getBiome.biomeTypes;
		if (!biomeTypes) {
			const { BiomeTypes } = await import("@minecraft/server");
			biomeTypes = BiomeTypes;
		}
		if (!biomeTypes) throw Error("DimensionUtils.getDimension() Requires Beta API!");
		if (!this.getBiome.biomeTypes) this.getBiome.biomeTypes = biomeTypes;

		//the rest of the code
		if (!(dimension instanceof Dimension))
			if (typeof dimension == "string") dimension = world.getDimension(dimension);
			else throw Error("dimension is invalid.");
		const allBiome = biomeTypes.getAll();
		const height = dimension.heightRange;
		const distance = (a, b) => {
			const xyz = {
				x: a.x - b.x,
				y: a.y - b.y,
				z: a.z - b.z,
			};
			return Math.sqrt(xyz.x ** 2 + xyz.y ** 2 + xyz.z ** 2);
		};
		let priority = 0;
		return new Promise((resolve) => {
			system.runJob(
				(function* () {
					let biomeFound = [];
					let baseBiome = [];
					for (let i = 0; i < allBiome.length; i++) {
						let bLoc1 = dimension.findClosestBiome(
							{
								x: location.x,
								y: location.y + 32,
								z: location.z,
							},
							allBiome[i],
							{
								boundingSize: {
									x: 64,
									y: 64,
									z: 64,
								},
							},
						);

						let bLoc2 = dimension.findClosestBiome(
							{
								x: location.x,
								y: height.max,
								z: location.z,
							},
							allBiome[i],
							{
								boundingSize: {
									x: 64,
									y: 64,
									z: 64,
								},
							},
						);

						if (bLoc2) baseBiome.push([allBiome[i].id, distance(bLoc2, location)]);

						if (!bLoc1) {
							yield;
							continue;
						}
						const bLoc1Dist = distance(
							{
								x: bLoc1.x,
								y: 0,
								z: bLoc1.z,
							},
							{
								x: location.x,
								y: 0,
								z: location.z,
							},
						);

						if (!priority && !bLoc2) {
							priority = 1;
							biomeFound = [];
						}
						if (priority ? !bLoc2 : bLoc2) {
							biomeFound.push([allBiome[i].id, bLoc1Dist]);
						}
						yield;
					}
					baseBiome = baseBiome.sort((a, b) => a[1] - b[1])[0];
					const biome = biomeFound.sort((a, b) => a[1] - b[1])[0];
					return resolve(biome[1] > 50 ? baseBiome : biome[0]);
				})(),
			);
		});
	}

	static async chunkLoader(loc, dim) {
		if (!(dim instanceof Dimension)) {
			console.warn("Invalid dimension!");
			return;
		}
		if (typeof loc !== "object") {
			console.warn("Invalid coordinates!");
			return;
		}

		const { x, y, z } = loc;
		const timeout = Date.now() + 20000;
		const id = Math.random().toString(36).substring(2);
		dim.runCommand(`tickingarea add ${x} ${y} ${z} ${x} ${y} ${z} "${id}"`);
		return new Promise((res, rej) => {
			const interval = system.runInterval(() => {
				if (dim.getBlock(loc)) {
					system.clearRun(interval);
					dim.runCommand(`tickingarea remove ${id}`);
					res("Loaded chunk.");
				}

				if (Date.now() > timeout) {
					system.clearRun(interval);
					dim.runCommand(`tickingarea remove ${id}`);
					rej("Timed out.");
				}
			});
		});
	}
}
