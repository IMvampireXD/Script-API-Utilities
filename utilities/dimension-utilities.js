import { Dimension, ItemStack, system, world } from "@minecraft/server";

export class DimensionUtils {

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
        // Error Handling
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
        // Create the item
        const item = new ItemStack(typeId, amount);
        // Apply nameTag if provided
        if (nameTag)
            item.nameTag = nameTag;
        // Spawn the item
        try {
            dimension.spawnItem(item, location);
        }
        catch (error) {
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
        let block, { x, y, z } = location;
        const getBlock = dim.getBlock.bind(dim, location);
        try { if (!(block = getBlock())) throw null; else return block }
        catch {
            dim.runCommand(`tickingarea add circle ${~~x} ${~~y} ${~~z} 0 "${x},${y},${z}"`);
            let remove = () => dim.runCommand(`tickingarea remove "${x},${y},${z}"`);
            return new Promise(async resolve => {
                system.runJob(function* () {

                    let trials = 1e3;
                    do {
                        block = getBlock();
                        if (!--trials) yield void remove();
                    } while (!block);
                    remove();
                    return resolve(block);
                }())
            })
        }
    };

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
    static async getBiome(location,dimension) {
        //Safeguard if using stable api when importing BiomeTypes
        let biomeTypes = this.getBiome.biomeTypes;
        if (!biomeTypes) {
            const { BiomeTypes } = await import("@minecraft/server");
            biomeTypes = BiomeTypes
        }
        if (!biomeTypes) throw Error("DimensionUtils.getDimension() Requires Beta API!")
        if (!this.getBiome.biomeTypes)
            this.getBiome.biomeTypes = biomeTypes

        //the rest of the code
        if (!(dimension instanceof Dimension))
        if (typeof dimension == "string")
            dimension = world.getDimension(dimension)
        else throw Error("dimension is invalid.")
        const allBiome = biomeTypes.getAll()
        const height = dimension.heightRange;
        const distance = (a,b) => {
            const xyz = {
                x: a.x - b.x,
                y: a.y - b.y,
                z: a.z - b.z
            }
            return Math.sqrt(xyz.x ** 2 + xyz.y ** 2 + xyz.z ** 2)
        }
        let priority = 0;
        return new Promise((resolve)=>{
            system.runJob((function *() {
                let biomeFound = []
                let baseBiome = [];
                for (let i=0; i<allBiome.length; i++) {
                    let bLoc1 = dimension.findClosestBiome({
                        x: location.x,
                        y: location.y+32,
                        z: location.z
                    },allBiome[i],{
                        boundingSize: {
                            x: 64,
                            y: 64,
                            z: 64
                        }
                    })
    
                    let bLoc2 = dimension.findClosestBiome({
                        x: location.x,
                        y: height.max,
                        z: location.z
                    },allBiome[i],{
                        boundingSize: {
                            x: 64,
                            y: 64,
                            z: 64
                        }
                    })
    
                    if (bLoc2)
                        baseBiome.push([allBiome[i].id,distance(bLoc2,location)])
                    
                    if (!bLoc1) { yield; continue;}
                    const bLoc1Dist = distance({
                        x: bLoc1.x,
                        y: 0,
                        z: bLoc1.z
                    },{
                        x: location.x,
                        y: 0,
                        z: location.z
                    })
                    
                    if (!priority && !bLoc2) {
                        priority = 1;
                        biomeFound = []
                    }
                    if (priority ? !bLoc2 : bLoc2) {
                        biomeFound.push([allBiome[i].id,bLoc1Dist])
                    }
                    yield
                }
                baseBiome = baseBiome.sort((a,b)=>a[1]-b[1])[0];
                const biome = biomeFound.sort((a,b)=>a[1]-b[1])[0];
                return resolve(biome[1] > 50 ? baseBiome : biome[0])
            })())
        })
    }
    /**
     * Returns which player is in which dimension.
     * @author Dmahonjr06
     * @param {DimensionTypes.typeId} [dimensionType] - The dimension to check if someone entered. e.g; "minecraft:overworld", "minecraft:nether", "minecraft:end"
     * @param {Boolean} [chatOutput] - A boolean for if the output information is to be sent to the chats of Operators.
     * @requires - scripting version 2.0.0-beta if [chatOutput]
     * @example
     * import { DimensionUtils } from "./utilities/dimension-utilities";
     * 
     * //Used to monitor if someone enters the Nether. For moderation purposes
       DimensionUtils.logAllPlayersEnteringDimension("minecraft:nether", true);
     */

    // TODO: Make a @param for chatOutput. If true, send a message to players that have isOp = true
    static async logAllPlayersEnteringDimension(dimensionType = undefined, chatOutput = false) {
        world.afterEvents.playerDimensionChange.subscribe(e=>{
            let allPlayers = world.getAllPlayers()
            const {toDimension, toLocation, player, fromLocation, fromDimension} = e;
            try {
                if(typeof dimensionType !== "string") throw new Error(`dimensionType is a ${typeof dimensionType}. dimensionType needs to be a string`);
                if(dimensionType !== ("minecraft:overworld"||"minecraft:nether"||"minecraft:end") && typeof dimensionType == "string") throw new Error(`dimensionType needs to be a DimensionType; "minecraft:overworld", "minecraft:nether" or "minecraft:end"`);
            } catch (error) {
                console.error(error)
            }
            if (toDimension.id == dimensionType && chatOutput){
                console.log("test")
                allPlayers.forEach(player => {
                    if (player.isOp())
                    {
                        player.sendMessage(`\n${e.player.name} has entered the ${dimensionType}\nThey entered at co-ordinates: ${fromLocation.x.toFixed(0)}, ${fromLocation.y.toFixed(0)}, ${fromLocation.z.toFixed(0)} in the ${fromDimension.id} and exited at co-ordinates: ${toLocation.x.toFixed(0)}, ${toLocation.y.toFixed(0)}, ${toLocation.z.toFixed(0)} in the ${toDimension.id}`)
                    } else {
                        throw new Error("There are no players that are operator!"); 
                    };
                    }
                );
            };
            if (toDimension.id == dimensionType && !chatOutput){
                console.log(`\n${player.name} has entered the ${dimensionType}\nThey entered at co-ordinates: ${fromLocation.x.toFixed(0)}, ${fromLocation.y.toFixed(0)}, ${fromLocation.z.toFixed(0)} in the ${fromDimension.id} and exited at co-ordinates: ${toLocation.x.toFixed(0)}, ${toLocation.y.toFixed(0)}, ${toLocation.z.toFixed(0)} `)
            }
            
        })
    }
}
