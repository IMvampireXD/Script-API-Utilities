import * as mc from '@minecraft/server'
import MersenneTwister from "./Math_Libraries/MersenneTwister.js"

/**
 * A class for managing chunks.
 * Load and unload chunks asynchronously, Check if the chunk is a slime chunk, etc.
 */
export default class Chunk {
    #baseX;
    #baseZ;
    #dimension;

    /**
     * @param {number} x - World X coordinates
     * @param {number} z - World Z coordinates
     * @param {Dimension} dimension - The dimension of where to define the chunk.
     */
    constructor(x, z, dimension = mc.world.getDimension("overworld")) {
        if (typeof x !== "number" || typeof z !== "number") {
            throw new TypeError("Invalid coordinates.");
        }
        if (!(dimension instanceof mc.Dimension)) {
            throw new TypeError("Invalid dimension.");
        }
        this.#baseX = x;
        this.#baseZ = z;
        this.#dimension = dimension;
        const getChunk = (vec, divide_floor = 16, product = divide_floor) => {
            divide_floor = Math.abs(divide_floor);
            const result = {};
            for (const key of Object.getOwnPropertyNames(vec))
                typeof vec[key] === "number"
                    && key !== "length"
                    && (result[key] = Math.floor(vec[key] / divide_floor) * product);
            return result;
        };
        const chunkVec = getChunk({ x, z });
        this.minX = chunkVec.x;
        this.minZ = chunkVec.z;
        this.maxX = this.minX + 15;
        this.maxZ = this.minZ + 15;
        this.worldX = Math.floor(this.minX / 16);
        this.worldZ = Math.floor(this.minZ / 16);
        this.center = { x: this.minX + 7.5, y: 64, z: this.minZ + 7.5 }
    }

    /**
     * Check if the chunk is a slime chunk
     * @returns {boolean}
     */
    isSlimeChunk() {
        const chunkX = Math.floor(this.#baseX / 16) >>> 0;
        const chunkZ = Math.floor(this.#baseZ / 16) >>> 0;
        const mul32_lo = (a, b) => {
            let a00 = a & 0xffff;
            let a16 = a >>> 16;
            let b00 = b & 0xffff;
            let b16 = b >>> 16;
            let c00 = a00 * b00;
            let c16 = c00 >>> 16;

            c16 += a16 * b00;
            c16 &= 0xffff;
            c16 += a00 * b16;

            let lo = c00 & 0xffff;
            let hi = c16 & 0xffff;

            return ((hi << 16) | lo) >>> 0;
        }
        const seed = mul32_lo(chunkX, 0x1f1f1f1f) ^ chunkZ;
        const mt = new MersenneTwister(seed);
        const n = mt.nextInt();
        const isSlime = (n % 10 == 0);

        return isSlime;
    }

    /**
     * Loads this chunk asynchronously using ticking areas.
     * If the chunk is already loaded, the function will return immediately.
     * @returns {Promise<string>}
     */
    async loadChunk() {
        const dim = this.#dimension;
        const loc = this.center;
        if (dim.isChunkLoaded(loc)) {
            console.warn(`The Chunk is already loaded.`);
            return;
        }
        const id = `chunk_${this.worldX}_${this.worldZ}_${Math.random().toString(36).slice(2)}`;
        this.tickingAreaId = id;
        const timeout = Date.now() + 20000;
        try {
            dim.runCommand(`tickingarea add circle ${Math.floor(loc.x)} ${Math.floor(loc.y)} ${Math.floor(loc.z)} 1 "${id}"`);
        } catch {
            console.warn("Failed to load chunk.");
        }
        return new Promise((res, rej) => {
            const interval = system.runInterval(() => {
                if (dim.isChunkLoaded(loc)) {
                    system.clearRun(interval);
                    return res("Loaded chunk.");
                }
                if (Date.now() > timeout) {
                    system.clearRun(interval);
                    dim.runCommand(`tickingarea remove "${id}"`);
                    return rej("Timed out while loading chunk.");
                }
            });
        });
    }

    /**
    * Unloads the chunk after it has been loaded.
    */
    async unloadChunk() {
        if (!this.tickingAreaId) {
            console.warn("No active ticking area to remove.");
            return;
        }
        try {
            this.#dimension.runCommand(`tickingarea remove "${this.tickingAreaId}"`);
            console.warn(`Chunk [${this.worldX}, ${this.worldZ}] unloaded.`);
        } catch {
            console.warn(`Failed to remove ticking area for chunk [${this.worldX}, ${this.worldZ}].`);
        }
        this.tickingAreaId = undefined;
    }
}

